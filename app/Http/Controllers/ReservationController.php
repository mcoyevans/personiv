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

use App\Notifications\ReservationCreated;
use App\Notifications\PostCreated;

use Auth;
use Carbon\Carbon;
use DB;
use Gate;
use Notification;

class ReservationController extends Controller
{
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
            $reservation = Reservation::with('location', 'user')->where('id', $request->id)->first();

            $reservation->schedule_approver_id = $request->user()->id;

            $reservation->save();

            if($reservation->schedule_approver_id && $reservation->equipment_approver_id)
            {
                $post = new Post;

                $post->title = 'Room reservation for ' . $reservation->location->name;
                $post->body = $reservation->user->name .' requested a room reservation for ' .$reservation->location->name. ' from ' .Carbon::parse($reservation->start)->toDayDateTimeString(). ' to '. Carbon::parse($reservation->end)->toDayDateTimeString().'.';
                $post->pinned = false;
                $post->allow_comments = true;
                $post->user_id = $reservation->user_id;

                $post->save();

                $post->load('user');

                $tags = ['#Room Reservation', '#'.$reservation->location->name];

                $hashtags = array();

                foreach ($tags as $item) {
                    $hashtag = new Hashtag(['tag' => $item]);

                    array_push($hashtags, $hashtag);
                }

                $post->hashtags()->saveMany($hashtags);

                $users = User::whereNotIn('id', [$request->user()->id])->get();

                Notification::send($users, new PostCreated($post));
            }
        });
    }

    /**
     * Decline reservation according to users authorization.
     *
     * @return \Illuminate\Http\Response
     */
    public function decline(Request $request)
    {
        if(!Gate::forUser($request->user())->allows('approvals'))
        {
            abort(403, 'Unauthorized action');
        }
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

        $new = Reservation::whereNotNull('schedule_approver_id')->whereNotNull('equipment_approver_id')->where('location_id', $request->location_id)
            ->where(function($query) use ($start, $end){
                // in between approved reservation
                $query->where('start', '<=', $start)->where('end', '>=', $end);
                // overlap on start of approved reservation
                $query->orWhereBetween('start', [$start, $end]);
                // overlap on end of approved reservation
                $query->orWhereBetween('end', [$start, $end]);
            })->first();

        $existing = Reservation::whereNotIn('id', [$request->id])->whereNotNull('schedule_approver_id')->whereNotNull('equipment_approver_id')->where('location_id', $request->location_id)
            ->where(function($query) use ($start, $end){
                // in between approved reservation
                $query->where('start', '<=', $start)->where('end', '>=', $end);
                // overlap on start of approved reservation
                $query->orWhereBetween('start', [$start, $end]);
                // overlap on end of approved reservation
                $query->orWhereBetween('end', [$start, $end]);
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

                                $query->whereNull('schedule_approver_id')->whereNull('equipment_approver_id');
                                $query->where(function($query) use ($start, $end){
                                    // in between approved reservation
                                    $query->where('start', '<=', $start)->where('end', '>=', $end);
                                    // overlap on start of approved reservation
                                    $query->orWhereBetween('start', [$start, $end]);
                                    // overlap on end of approved reservation
                                    $query->orWhereBetween('end', [$start, $end]);
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

        $duplicate = Reservation::whereNotNull('schedule_approver_id')->whereNotNull('equipment_approver_id')->where('location_id', $request->location_id)
            ->where(function($query) use ($start, $end){
                // in between approved reservation
                $query->where('start', '<=', $start)->where('end', '>=', $end);
                // overlap on start of approved reservation
                $query->orWhereBetween('start', [$start, $end]);
                // overlap on end of approved reservation
                $query->orWhereBetween('end', [$start, $end]);
            })->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        DB::transaction(function() use($request, $start, $end){
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

            $users = User::whereNotIn('id', [$request->user()->id])->whereIn('group_id', [1,2])->get();

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

        $duplicate = Reservation::whereNotIn('id', [$id])->whereNotNull('schedule_approver_id')->whereNotNull('equipment_approver_id')->where('location_id', $request->location_id)
            ->where(function($query) use ($start, $end){
                // in between approved reservation
                $query->where('start', '<=', $start)->where('end', '>=', $end);
                // overlap on start of approved reservation
                $query->orWhereBetween('start', [$start, $end]);
                // overlap on end of approved reservation
                $query->orWhereBetween('end', [$start, $end]);
            })->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        DB::transaction(function() use($request, $start, $end, $id){
            $reservation = Reservation::where('id', $id)->first();

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
            $reservation->allDay = $request->allDay ? true : false;

            $reservation->save();

            $reservation->load('user');

            if($request->has('equipment_types'))
            {
                ReservationEquipment::where('reservation_id', $id)->delete();

                for ($i=0; $i < count($request->equipment_types); $i++) { 
                    if(isset($request->input('equipment_types')[$i]['id']))
                    {
                        $reservation->equipment_types()->save(EquipmentType::find($request->input('equipment_types')[$i]['id']), ['approved' => false]);
                    }
                }
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
        $reservation = Reservation::withCount('equipment_types')->where('id', $id)->first();

        $this->authorize('delete', $reservation);

        if($reservation->equipment_types_count)
        {
            ReservationEquipment::where('reservation_id', $id)->delete();
        }

        $reservation->delete();
    }
}
