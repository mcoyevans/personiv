<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\Reservation;
use App\ReservationEquipment;
use App\EquipmentType;
use App\Hashtag;
use App\Post;
use App\User;

use App\Notifications\ReservationApproved;
use App\Notifications\ReservationApprovedConfirmation;
use App\Notifications\ReservationCreated;
use App\Notifications\ReservationUpdated;
use App\Notifications\ReservationCancelled;
use App\Notifications\ReservationDeleted;
use App\Notifications\ReservationDisapproved;
use App\Notifications\RescheduleReservation;
use App\Notifications\PostCreated;

use Auth;
use Carbon\Carbon;
use DB;
use Gate;
use Notification;

class ReservationController extends Controller
{
    /**
     * Reschedule reservation by F&A.
     *
     * @return \Illuminate\Http\Response
     */
    public function reschedule(Request $request)
    {
        if(!Gate::forUser($request->user())->allows('approvals'))
        {
            abort(403, 'Unauthorized action');
        }

        $reservation = Reservation::find($request->id);

        $reservation->schedule_approver_id = $request->user()->id;

        $reservation->disapproved_schedule = 1;

        $reservation->save();

        $recipient = User::find($reservation->user_id);

        Notification::send($recipient, new RescheduleReservation($reservation, $request->user()));
    }

    /**
     * Approve reservation according to users authorization.
     *
     * @return \Illuminate\Http\Response
     */
    public function approve(Request $request)
    {
        if(!Gate::forUser($request->user())->allows('approvals'))
        {
            abort(403, 'Unauthorized action');
        }

        $duplicate = Reservation::whereNotIn('id', [$request->id])->whereNotNull('schedule_approver_id')->where('location_id', $request->location_id)
            ->where(function($query) use ($request){
                // in between approved reservation
                $query->where('start', '<=', Carbon::parse($request->start))->where('end', '>=', Carbon::parse($request->end));
                // overlap on start of approved reservation
                $query->orWhereBetween('start', [Carbon::parse($request->start), Carbon::parse($request->end)]);
                // overlap on end of approved reservation
                $query->orWhereBetween('end', [Carbon::parse($request->start), Carbon::parse($request->end)]);
            })->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        $this->validate($request, [
            'id' => 'required',
        ]);

        DB::transaction(function() use($request){
            $reservation = Reservation::with('location', 'user')->withCount('equipment_types')->where('id', $request->id)->first();

            $reservation->schedule_approver_id = $request->user()->id;

            $reservation->save();

            if(($reservation->schedule_approver_id && $reservation->equipment_approver_id && $reservation->equipment_types_count) || ($reservation->schedule_approver_id && !$reservation->equipment_types_count))
            {
                // $post = new Post;

                // $post->title = 'Room reservation for ' . $reservation->location->name;
                // $post->body = $reservation->user->name .' requested a room reservation for ' .$reservation->location->name. ' from ' .Carbon::parse($reservation->start)->toDayDateTimeString(). ' to '. Carbon::parse($reservation->end)->toDayDateTimeString().'.';
                // $post->allow_comments = true;
                // $post->user_id = $reservation->user_id;

                // $post->save();

                // $post->load('user');

                // $tags = ['#Room Reservation', '#'.$reservation->location->name];

                // $hashtags = array();

                // foreach ($tags as $item) {
                //     $hashtag = new Hashtag(['tag' => $item]);

                //     array_push($hashtags, $hashtag);
                // }

                // $post->hashtags()->saveMany($hashtags);

                // $users = User::whereNotIn('id', [$request->user()->id])->get();

                // Notification::send($users, new PostCreated($post));

                $recipient = User::find($reservation->user_id);

                Notification::send($recipient, new ReservationApproved($reservation, $request->user()));

                Notification::send($request->user(), new ReservationApprovedConfirmation($reservation, $recipient, $request->user()));
            }
        });
    }

    /**
     * Disapprove reservation according to users authorization.
     *
     * @return \Illuminate\Http\Response
     */
    public function disapprove(Request $request)
    {
        if(!Gate::forUser($request->user())->allows('approvals'))
        {
            abort(403, 'Unauthorized action');
        }

        $this->validate($request, [
            'id' => 'required',
        ]);

        DB::transaction(function() use($request){
            $reservation = Reservation::with('location', 'user')->with('equipment_types')->where('id', $request->id)->first();

            if($request->user()->group_id == 1)
            {
                $reservation->equipment_approver_id = null;
                
                foreach ($reservation->equipment_types as $key => $equipment) {
                    $equipment->approved = false;

                    $equipment->save();
                }
            }

            else if($request->user()->group_id == 2)
            {
                $reservation->schedule_approver_id = null;
            }

            $reservation->save();

            Notification::send($reservation->user, new ReservationDisapproved($reservation, $request->user()));
        });
    }

    /**
     * Checks the time start and end availability.
     *
     * @return \Illuminate\Http\Response
     */
    public function checkDuplicate(Request $request)
    {
        $start = Carbon::parse($request->date_start .' '. $request->time_start);
        $end = Carbon::parse($request->date_end .' '. $request->time_end);

        if($request->has('repeat'))
        {
            $until = Carbon::parse($request->until .' '. $request->time_end);

            if($request->repeat == 'Daily')
            {
                $date_end = Carbon::parse($request->date_end .' '. $request->time_end);
                
                for ($date_start = Carbon::parse($request->date_start .' '. $request->time_start); $date_start->lte($until); $date_start->addDay()) { 

                    if($request->has('id'))
                    {
                        $reservation = Reservation::whereNotIn('id', [$request->id])->whereNotNull('schedule_approver_id')->where('location_id', $request->location_id)
                            ->where(function($query) use ($date_start, $date_end){
                                // in between approved reservation
                                $query->where('start', '<=', $date_start)->where('end', '>=', $date_end);
                                // overlap on start of approved reservation
                                // $query->orWhereBetween('start', [$date_start, $date_end]);
                                $query->orWhere(function($query) use($date_start, $date_end){
                                    $query->where('start', '>', $date_start)->where('end', '<', $date_end);
                                });
                                // overlap on end of approved reservation
                                // $query->orWhereBetween('end', [$date_start, $date_end]);
                                $query->orWhere(function($query) use($date_start, $date_end){
                                    $query->where('end', '>', $date_start)->where('end', '<', $date_end);
                                });
                            })->first();
                    }
                    else{
                        $reservation = Reservation::whereNotNull('schedule_approver_id')->where('location_id', $request->location_id)
                            ->where(function($query) use ($date_start, $date_end){
                                // in between approved reservation
                                $query->where('start', '<=', $date_start)->where('end', '>=', $date_end);
                                // overlap on start of approved reservation
                                // $query->orWhereBetween('start', [$date_start, $date_end]);
                                $query->orWhere(function($query) use($date_start, $date_end){
                                    $query->where('start', '>', $date_start)->where('end', '<', $date_end);
                                });
                                // overlap on end of approved reservation
                                // $query->orWhereBetween('end', [$date_start, $date_end]);
                                $query->orWhere(function($query) use($date_start, $date_end){
                                    $query->where('end', '>', $date_start)->where('end', '<', $date_end);
                                });
                            })->first();
                    }

                    $date_end->addDay();

                    if($reservation)
                    {
                        return response()->json(true);
                    }
                }                
            }

            else if($request->repeat == 'Weekly')
            {
                $date_end = Carbon::parse($request->date_end .' '. $request->time_end);
                
                for ($date_start = Carbon::parse($request->date_start .' '. $request->time_start); $date_start->lte($until); $date_start->addWeek()) { 

                    if($request->has('id'))
                    {
                        $reservation = Reservation::whereNotIn('id', [$request->id])->whereNotNull('schedule_approver_id')->where('location_id', $request->location_id)
                            ->where(function($query) use ($date_start, $date_end){
                                // in between approved reservation
                                $query->where('start', '<=', $date_start)->where('end', '>=', $date_end);
                                // overlap on start of approved reservation
                                // $query->orWhereBetween('start', [$date_start, $date_end]);
                                $query->orWhere(function($query) use($date_start, $date_end){
                                    $query->where('start', '>', $date_start)->where('end', '<', $date_end);
                                });
                                // overlap on end of approved reservation
                                // $query->orWhereBetween('end', [$date_start, $date_end]);
                                $query->orWhere(function($query) use($date_start, $date_end){
                                    $query->where('end', '>', $date_start)->where('end', '<', $date_end);
                                });
                            })->first();
                    }
                    else{
                        $reservation = Reservation::whereNotNull('schedule_approver_id')->where('location_id', $request->location_id)
                            ->where(function($query) use ($date_start, $date_end){
                                // in between approved reservation
                                $query->where('start', '<=', $date_start)->where('end', '>=', $date_end);
                                // overlap on start of approved reservation
                                // $query->orWhereBetween('start', [$date_start, $date_end]);
                                $query->orWhere(function($query) use($date_start, $date_end){
                                    $query->where('start', '>', $date_start)->where('end', '<', $date_end);
                                });
                                // overlap on end of approved reservation
                                // $query->orWhereBetween('end', [$date_start, $date_end]);
                                $query->orWhere(function($query) use($date_start, $date_end){
                                    $query->where('end', '>', $date_start)->where('end', '<', $date_end);
                                });
                            })->first();
                    }

                    $date_end->addWeek();

                    if($reservation)
                    {
                        return response()->json(true);
                    }
                }
            }

            else if($request->repeat == 'Monthly')
            {
                $date_end = Carbon::parse($request->date_end .' '. $request->time_end);
                
                for ($date_start = Carbon::parse($request->date_start .' '. $request->time_start); $date_start->lte($until); $date_start->addMonth()) { 

                    if($request->has('id'))
                    {
                        $reservation = Reservation::whereNotIn('id', [$request->id])->whereNotNull('schedule_approver_id')->where('location_id', $request->location_id)
                            ->where(function($query) use ($date_start, $date_end){
                                // in between approved reservation
                                $query->where('start', '<=', $date_start)->where('end', '>=', $date_end);
                                // overlap on start of approved reservation
                                // $query->orWhereBetween('start', [$date_start, $date_end]);
                                $query->orWhere(function($query) use($date_start, $date_end){
                                    $query->where('start', '>', $date_start)->where('end', '<', $date_end);
                                });
                                // overlap on end of approved reservation
                                // $query->orWhereBetween('end', [$date_start, $date_end]);
                                $query->orWhere(function($query) use($date_start, $date_end){
                                    $query->where('end', '>', $date_start)->where('end', '<', $date_end);
                                });
                            })->first();
                    }
                    else{
                        $reservation = Reservation::whereNotNull('schedule_approver_id')->where('location_id', $request->location_id)
                            ->where(function($query) use ($date_start, $date_end){
                                // in between approved reservation
                                $query->where('start', '<=', $date_start)->where('end', '>=', $date_end);
                                // overlap on start of approved reservation
                                // $query->orWhereBetween('start', [$date_start, $date_end]);
                                $query->orWhere(function($query) use($date_start, $date_end){
                                    $query->where('start', '>', $date_start)->where('end', '<', $date_end);
                                });
                                // overlap on end of approved reservation
                                // $query->orWhereBetween('end', [$date_start, $date_end]);
                                $query->orWhere(function($query) use($date_start, $date_end){
                                    $query->where('end', '>', $date_start)->where('end', '<', $date_end);
                                });
                            })->first();
                    }

                    $date_end->addMonth();

                    if($reservation)
                    {
                        return response()->json(true);
                    }
                }
            }

            return response()->json(false);
        }

        $new = Reservation::whereNotNull('schedule_approver_id')->where('location_id', $request->location_id)
            ->where(function($query) use ($start, $end){
                // in between approved reservation
                $query->where('start', '<=', $start)->where('end', '>=', $end);
                // overlap on start of approved reservation
                // $query->orWhereBetween('start', [$start, $end]);
                $query->orWhere(function($query) use($start, $end){
                    $query->where('start', '>', $start)->where('end', '<', $end);
                });
                // overlap on end of approved reservation
                // $query->orWhereBetween('end', [$start, $end]);
                $query->orWhere(function($query) use($start, $end){
                    $query->where('end', '>', $start)->where('end', '<', $end);
                });
            })->first();

        $existing = Reservation::whereNotIn('id', [$request->id])->whereNotNull('schedule_approver_id')->where('location_id', $request->location_id)
            ->where(function($query) use ($start, $end){
                // in between approved reservation
                $query->where('start', '<=', $start)->where('end', '>=', $end);
                // overlap on start of approved reservation
                // $query->orWhereBetween('start', [$start, $end]);
                $query->orWhere(function($query) use($start, $end){
                    $query->where('start', '>', $start)->where('end', '<', $end);
                });
                // overlap on end of approved reservation
                // $query->orWhereBetween('end', [$start, $end]);
                $query->orWhere(function($query) use($start, $end){
                    $query->where('end', '>', $start)->where('end', '<', $end);
                });
            })->first();

        $reservation = $request->id ? $existing : $new;

        return response()->json($reservation ? true : false);

    }

    /**
     * Display a listing of the resource with parameters.
     *
     * @return \Illuminate\Http\Response
     */
    public function enlist(Request $request)
    {
        $reservations = Reservation::query();

        if($request->has('withTrashed'))
        {
            $reservations->withTrashed();
        }

        if($request->has('with'))
        {
            for ($i=0; $i < count($request->with); $i++) { 
                if(isset($request->input('with')[$i]['available_units']))
                {
                    $reservation = Reservation::find($request->input('where')[0]['value']);

                    $reservations->with(['equipment_types' => function($query) use($request, $reservation){
                        $query->with(['equipment' => function($query) use($request, $reservation){
                            $query->whereDoesntHave('reservations', function($query) use($request, $reservation){
                                $start = Carbon::parse($reservation->start);
                                $end = Carbon::parse($reservation->end);

                                $query->whereNotNull('schedule_approver_id')->whereNotNull('equipment_approver_id');
                                $query->where(function($query) use ($start, $end){
                                    // in between approved reservation
                                    $query->where('start', '<=', $start)->where('end', '>=', $end);
                                    // overlap on start of approved reservation
                                    // $query->orWhereBetween('start', [$start, $end]);
                                    $query->orWhere(function($query) use($start, $end){
                                        $query->where('start', '>', $start)->where('end', '<', $end);
                                    });
                                    // overlap on end of approved reservation
                                    // $query->orWhereBetween('end', [$start, $end]);
                                    $query->orWhere(function($query) use($start, $end){
                                        $query->where('end', '>', $start)->where('end', '<', $end);
                                    });
                                });
                            });
                        }]);
                    }]);

                    continue;   
                }

                if(!$request->input('with')[$i]['withTrashed'])
                {
                    $reservations->with($request->input('with')[$i]['relation']);
                }
                else{
                    $reservations->with([$request->input('with')[$i]['relation'] => function($query){ 
                        $query->withTrashed();
                    }]);
                }
            }
        }

        if($request->has('withCount'))
        {
            for ($i=0; $i < count($request->withCount); $i++) { 
                if(!$request->input('withCount')[$i]['withTrashed'])
                {
                    $reservations->withCount($request->input('withCount')[$i]['relation']);
                }
            }
        }
        
        if($request->has('where'))
        {
            for ($i=0; $i < count($request->where); $i++) { 
                $reservations->where($request->input('where')[$i]['label'], $request->input('where')[$i]['condition'], $request->input('where')[$i]['value']);
            }
        }
        
        if($request->has('whereBetween'))
        {
            $reservations->whereBetween($request->input('whereBetween.label'), [Carbon::parse($request->input('whereBetween.start')), Carbon::parse($request->input('whereBetween.end'))]);   
        }
        else{
            $reservations->whereBetween('start', [Carbon::parse('first day of this month'), Carbon::parse('first day of next month')]);   
        }

        if($request->has('approvals'))
        {
            $reservations->where('start', '>=', Carbon::now());

            // IT
            if($request->user()->group_id == 1)
            {
                $reservations->whereNull('equipment_approver_id')->has('equipment_types');
            }

            // F & A
            if($request->user()->group_id == 2)
            {
                $reservations->whereNull('schedule_approver_id');
            }
        }

        if($request->has('search'))
        {
            $reservations->where('title', 'like', '%'.$request->search.'%');
        }

        if($request->has('paginate'))
        {
            return $reservations->paginate($request->paginate);
        }

        if($request->has('first'))
        {
            return $reservations->first();
        }

        return $reservations->get();
    }
    
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        if(!Gate::forUser($request->user())->allows('reservations'))
        {
            abort(403, 'Unauthorized action');
        }

        $this->validate($request, [
            'title' => 'required',
            'location_id' => 'required',
            'date_start' => 'required',
            'date_end' => 'required',
            'time_start' => 'required',
            'time_end' => 'required',
        ]);

        $start = Carbon::parse($request->date_start .' '. $request->time_start);
        $end = Carbon::parse($request->date_end .' '. $request->time_end);

        if($start->lt(Carbon::now()))
        {
            abort(422, 'Reservation cannot be earlier than current time.');
        }

        $until = null;

        if($request->has('until'))
        {
            $until = Carbon::parse($request->until .' '. $request->time_end);
        }
        
        if($request->has('repeat'))
        {
            if($request->repeat == 'Daily')
            {
                $date_end = Carbon::parse($request->date_end .' '. $request->time_end);
                
                for ($date_start = Carbon::parse($request->date_start .' '. $request->time_start); $date_start->lte($until); $date_start->addDay()) { 

                    if($request->has('id'))
                    {
                        $reservation = Reservation::whereNotIn('id', [$request->id])->whereNotNull('schedule_approver_id')->where('location_id', $request->location_id)
                            ->where(function($query) use ($date_start, $date_end){
                                // in between approved reservation
                                $query->where('start', '<=', $date_start)->where('end', '>=', $date_end);
                                // overlap on start of approved reservation
                                // $query->orWhereBetween('start', [$date_start, $date_end]);
                                $query->orWhere(function($query) use($date_start, $date_end){
                                    $query->where('start', '>', $date_start)->where('end', '<', $date_end);
                                });
                                // overlap on end of approved reservation
                                // $query->orWhereBetween('end', [$date_start, $date_end]);
                                $query->orWhere(function($query) use($date_start, $date_end){
                                    $query->where('end', '>', $date_start)->where('end', '<', $date_end);
                                });
                            })->first();
                    }
                    else{
                        $reservation = Reservation::whereNotNull('schedule_approver_id')->where('location_id', $request->location_id)
                            ->where(function($query) use ($date_start, $date_end){
                                // in between approved reservation
                                $query->where('start', '<=', $date_start)->where('end', '>=', $date_end);
                                // overlap on start of approved reservation
                                // $query->orWhereBetween('start', [$date_start, $date_end]);
                                $query->orWhere(function($query) use($date_start, $date_end){
                                    $query->where('start', '>', $date_start)->where('end', '<', $date_end);
                                });
                                // overlap on end of approved reservation
                                // $query->orWhereBetween('end', [$date_start, $date_end]);
                                $query->orWhere(function($query) use($date_start, $date_end){
                                    $query->where('end', '>', $date_start)->where('end', '<', $date_end);
                                });
                            })->first();
                    }

                    $date_end->addDay();

                    if($reservation)
                    {
                        return response()->json(true);
                    }
                }                
            }

            else if($request->repeat == 'Weekly')
            {
                $date_end = Carbon::parse($request->date_end .' '. $request->time_end);
                
                for ($date_start = Carbon::parse($request->date_start .' '. $request->time_start); $date_start->lte($until); $date_start->addWeek()) { 

                    if($request->has('id'))
                    {
                        $reservation = Reservation::whereNotIn('id', [$request->id])->whereNotNull('schedule_approver_id')->where('location_id', $request->location_id)
                            ->where(function($query) use ($date_start, $date_end){
                                // in between approved reservation
                                $query->where('start', '<=', $date_start)->where('end', '>=', $date_end);
                                // overlap on start of approved reservation
                                // $query->orWhereBetween('start', [$date_start, $date_end]);
                                $query->orWhere(function($query) use($date_start, $date_end){
                                    $query->where('start', '>', $date_start)->where('end', '<', $date_end);
                                });
                                // overlap on end of approved reservation
                                // $query->orWhereBetween('end', [$date_start, $date_end]);
                                $query->orWhere(function($query) use($date_start, $date_end){
                                    $query->where('end', '>', $date_start)->where('end', '<', $date_end);
                                });
                            })->first();
                    }
                    else{
                        $reservation = Reservation::whereNotNull('schedule_approver_id')->where('location_id', $request->location_id)
                            ->where(function($query) use ($date_start, $date_end){
                                // in between approved reservation
                                $query->where('start', '<=', $date_start)->where('end', '>=', $date_end);
                                // overlap on start of approved reservation
                                // $query->orWhereBetween('start', [$date_start, $date_end]);
                                $query->orWhere(function($query) use($date_start, $date_end){
                                    $query->where('start', '>', $date_start)->where('end', '<', $date_end);
                                });
                                // overlap on end of approved reservation
                                // $query->orWhereBetween('end', [$date_start, $date_end]);
                                $query->orWhere(function($query) use($date_start, $date_end){
                                    $query->where('end', '>', $date_start)->where('end', '<', $date_end);
                                });
                            })->first();
                    }

                    $date_end->addWeek();

                    if($reservation)
                    {
                        return response()->json(true);
                    }
                }
            }

            else if($request->repeat == 'Monthly')
            {
                $date_end = Carbon::parse($request->date_end .' '. $request->time_end);
                
                for ($date_start = Carbon::parse($request->date_start .' '. $request->time_start); $date_start->lte($until); $date_start->addMonth()) { 

                    if($request->has('id'))
                    {
                        $reservation = Reservation::whereNotIn('id', [$request->id])->whereNotNull('schedule_approver_id')->where('location_id', $request->location_id)
                            ->where(function($query) use ($date_start, $date_end){
                                // in between approved reservation
                                $query->where('start', '<=', $date_start)->where('end', '>=', $date_end);
                                // overlap on start of approved reservation
                                // $query->orWhereBetween('start', [$date_start, $date_end]);
                                $query->orWhere(function($query) use($date_start, $date_end){
                                    $query->where('start', '>', $date_start)->where('end', '<', $date_end);
                                });
                                // overlap on end of approved reservation
                                // $query->orWhereBetween('end', [$date_start, $date_end]);
                                $query->orWhere(function($query) use($date_start, $date_end){
                                    $query->where('end', '>', $date_start)->where('end', '<', $date_end);
                                });
                            })->first();
                    }
                    else{
                        $reservation = Reservation::whereNotNull('schedule_approver_id')->where('location_id', $request->location_id)
                            ->where(function($query) use ($date_start, $date_end){
                                // in between approved reservation
                                $query->where('start', '<=', $date_start)->where('end', '>=', $date_end);
                                // overlap on start of approved reservation
                                // $query->orWhereBetween('start', [$date_start, $date_end]);
                                $query->orWhere(function($query) use($date_start, $date_end){
                                    $query->where('start', '>', $date_start)->where('end', '<', $date_end);
                                });
                                // overlap on end of approved reservation
                                // $query->orWhereBetween('end', [$date_start, $date_end]);
                                $query->orWhere(function($query) use($date_start, $date_end){
                                    $query->where('end', '>', $date_start)->where('end', '<', $date_end);
                                });
                            })->first();
                    }

                    $date_end->addMonth();

                    if($reservation)
                    {
                        return response()->json(true);
                    }
                }
            }
        }

        $duplicate = Reservation::whereNotNull('schedule_approver_id')->where('location_id', $request->location_id)
            ->where(function($query) use ($start, $end){
                // in between approved reservation
                $query->where('start', '<=', $start)->where('end', '>=', $end);
                // overlap on start of approved reservation
                // $query->orWhereBetween('start', [$start, $end]);
                $query->orWhere(function($query) use($start, $end){
                    $query->where('start', '>', $start)->where('end', '<', $end);
                });
                // overlap on end of approved reservation
                // $query->orWhereBetween('end', [$start, $end]);
                $query->orWhere(function($query) use($start, $end){
                    $query->where('end', '>', $start)->where('end', '<', $end);
                });
            })->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        DB::transaction(function() use($request, $start, $end, $until){
            $reservation = new Reservation;

            $reservation->title = $request->title;
            $reservation->remarks = $request->remarks;
            $reservation->location_id = $request->location_id;
            $reservation->user_id = $request->user()->id;
            $reservation->start = $start->toDateTimeString();

            if(Carbon::parse($request->date_start .' '. $request->time_start)->gt(Carbon::parse($request->date_end .' '. $request->time_end)))
            {
                abort(422, 'End date cannot be earlier than start date');
            }

            $reservation->end = $end->toDateTimeString();
            $reservation->allDay = $request->has('allDay') ? true : false;

            $reservation->save();

            $reservation->load('user');

            if($request->has('equipment_types'))
            {
                for ($i=0; $i < count($request->equipment_types); $i++) { 
                    if(isset($request->input('equipment_types')[$i]['id']))
                    {
                        $reservation->equipment_types()->save(EquipmentType::find($request->input('equipment_types')[$i]['id']), ['approved' => false]);
                    }
                }
            }

            if($request->has('repeat'))
            {
                if(Carbon::parse($request->date_end .' '. $request->time_end)->gt(Carbon::parse($request->until .' '. $request->time_end)))
                {
                    abort(422, 'Last date of repeat cannot be earlier than end date');
                }

                $reservation->repeat = $request->repeat;

                if($request->repeat == 'Daily')
                {
                    $date_end = Carbon::parse($request->date_end .' '. $request->time_end)->addDay();

                    for ($date_start = Carbon::parse($request->date_start .' '. $request->time_start)->addDay(); $date_start->lte($until); $date_start->addDay()) { 
                        $repeat = new Reservation;

                        $repeat->title = $request->title;
                        $repeat->remarks = $request->remarks;
                        $repeat->location_id = $request->location_id;
                        $repeat->user_id = $request->user()->id;
                        $repeat->start = $date_start->toDateTimeString();
                        $repeat->end = $date_end->toDateTimeString();
                        $repeat->allDay = $request->has('allDay') ? true : false;

                        $repeat->save();

                        if($request->has('equipment_types'))
                        {
                            for ($i=0; $i < count($request->equipment_types); $i++) { 
                                if(isset($request->input('equipment_types')[$i]['id']))
                                {
                                    $repeat->equipment_types()->save(EquipmentType::find($request->input('equipment_types')[$i]['id']), ['approved' => false]);
                                }
                            }
                        }

                        $date_end->addDay();
                    }
                }

                if($request->repeat == 'Weekly')
                {
                    $date_end = Carbon::parse($request->date_end .' '. $request->time_end)->addWeek();

                    for ($date_start = Carbon::parse($request->date_start .' '. $request->time_start)->addWeek(); $date_start->lte($until); $date_start->addWeek()) { 
                        $repeat = new Reservation;

                        $repeat->title = $request->title;
                        $repeat->remarks = $request->remarks;
                        $repeat->location_id = $request->location_id;
                        $repeat->user_id = $request->user()->id;
                        $repeat->start = $date_start->toDateTimeString();
                        $repeat->end = $date_end->toDateTimeString();
                        $repeat->allDay = $request->has('allDay') ? true : false;

                        $repeat->save();

                        if($request->has('equipment_types'))
                        {
                            for ($i=0; $i < count($request->equipment_types); $i++) { 
                                if(isset($request->input('equipment_types')[$i]['id']))
                                {
                                    $repeat->equipment_types()->save(EquipmentType::find($request->input('equipment_types')[$i]['id']), ['approved' => false]);
                                }
                            }
                        }

                        $date_end->addWeek();
                    }
                }

                if($request->repeat == 'Monthly')
                {
                    $date_end = Carbon::parse($request->date_end .' '. $request->time_end)->addMonth();

                    for ($date_start = Carbon::parse($request->date_start .' '. $request->time_start)->addMonth(); $date_start->lte($until); $date_start->addMonth()) { 
                        $repeat = new Reservation;

                        $repeat->title = $request->title;
                        $repeat->remarks = $request->remarks;
                        $repeat->location_id = $request->location_id;
                        $repeat->user_id = $request->user()->id;
                        $repeat->start = $date_start->toDateTimeString();
                        $repeat->end = $date_end->toDateTimeString();
                        $repeat->allDay = $request->has('allDay') ? true : false;

                        $repeat->save();

                        if($request->has('equipment_types'))
                        {
                            for ($i=0; $i < count($request->equipment_types); $i++) { 
                                if(isset($request->input('equipment_types')[$i]['id']))
                                {
                                    $repeat->equipment_types()->save(EquipmentType::find($request->input('equipment_types')[$i]['id']), ['approved' => false]);
                                }
                            }
                        }

                        $date_end->addMonth();
                    }
                }
            }

            $user_groups = count($request->equipment_types) ? array(1,2) : array(2);

            $users = User::whereNotIn('id', [$request->user()->id])->whereIn('group_id', $user_groups)->whereHas('roles', function($query){
                $query->where('name', 'approvals');
            })->get();

            Notification::send($users, new ReservationCreated($reservation));
        });
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $this->authorize('update', Reservation::find($id));

        $this->validate($request, [
            'title' => 'required',
            'location_id' => 'required',
            'date_start' => 'required',
            'date_end' => 'required',
            'time_start' => 'required',
            'time_end' => 'required',
        ]);

        $start = Carbon::parse($request->date_start .' '. $request->time_start);
        $end = Carbon::parse($request->date_end .' '. $request->time_end);

        if($start->lt(Carbon::now()))
        {
            abort(422, 'Reservation cannot be earlier than current time.');
        }

        $duplicate = Reservation::whereNotIn('id', [$id])->whereNotNull('schedule_approver_id')->where('location_id', $request->location_id)
            ->where(function($query) use ($start, $end){
                // in between approved reservation
                $query->where('start', '<=', $start)->where('end', '>=', $end);
                // overlap on start of approved reservation
                // $query->orWhereBetween('start', [$start, $end]);
                $query->orWhere(function($query) use($start, $end){
                    $query->where('start', '>', $start)->where('end', '<', $end);
                });
                // overlap on end of approved reservation
                // $query->orWhereBetween('end', [$start, $end]);
                $query->orWhere(function($query) use($start, $end){
                    $query->where('end', '>', $start)->where('end', '<', $end);
                });
            })->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        DB::transaction(function() use($request, $start, $end, $id){
            $reservation = Reservation::where('id', $id)->first();

            if($reservation->equipment_approver_id || $reservation->schedule_approver_id)
            {
                $notify = true;
            }

            $reservation->title = $request->title;
            $reservation->remarks = $request->remarks;
            $reservation->location_id = $request->location_id;
            $reservation->user_id = $request->user()->id;
            $reservation->start = $start->toDateTimeString();
            $reservation->schedule_approver_id = null;
            $reservation->equipment_approver_id = null;
            $reservation->disapproved_schedule = 0;

            if(Carbon::parse($request->date_start .' '. $request->time_start)->gt(Carbon::parse($request->date_end .' '. $request->time_end)))
            {
                abort(422, 'End date cannot be earlier than start date');
            }

            $reservation->end = $end->toDateTimeString();
            $reservation->allDay = $request->allDay ? true : false;

            ReservationEquipment::where('reservation_id', $id)->delete();
            
            if($request->has('equipment_types'))
            {
                for ($i=0; $i < count($request->equipment_types); $i++) { 
                    if(isset($request->input('equipment_types')[$i]['id']))
                    {
                        $reservation->equipment_types()->save(EquipmentType::find($request->input('equipment_types')[$i]['id']), ['approved' => false]);
                    }
                }
            }

            $reservation->save();

            $reservation->load('user');

            if($notify)
            {
                $user_groups = count($request->equipment_types) ? array(1,2) : array(2);

                $users = User::whereNotIn('id', [$request->user()->id])->whereIn('group_id', $user_groups)->whereHas('roles', function($query){
                    $query->where('name', 'approvals');
                })->get();

                Notification::send($users, new ReservationUpdated($reservation));
            }

        });
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $reservation = Reservation::with('user')->withCount('equipment_types')->where('id', $id)->first();

        $this->authorize('delete', $reservation);

        DB::transaction(function() use($reservation, $id){        
            if($reservation->equipment_types_count)
            {
                ReservationEquipment::where('reservation_id', $id)->delete();
            }

            if(Auth::user()->id == $reservation->user_id)
            {
                $group = $reservation->equipment_types_count ? array(1,2) : array(2);

                $users = User::whereNotIn('id', [Auth::user()->id])->whereIn('group_id', $group)->whereHas('roles', function($query){
                    $query->where('name', 'approvals');
                })->get();

                Notification::send($users, new ReservationCancelled($reservation));
            }
            else{
                Notification::send($reservation->user, new ReservationDeleted($reservation, Auth::user()));
            }

            $reservation->delete();
        });
    }
}
