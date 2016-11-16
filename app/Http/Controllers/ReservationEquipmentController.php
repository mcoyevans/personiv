<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\Hashtag;
use App\Post;
use App\Reservation;
use App\ReservationEquipment;
use App\User;

use App\Notifications\PostCreated;

use Auth;
use Carbon\Carbon;
use DB;
use Gate;
use Notification;

class ReservationEquipmentController extends Controller
{
    /**
     * Approve equipment.
     *
     * @return \Illuminate\Http\Response
     */
    public function approve(Request $request)
    {
        if(!Gate::forUser($request->user())->allows('approvals') && $request->user()->group_id != 1)
        {
            abort(403, 'Unauthorized action.');
        }

        DB::transaction(function() use($request){
            $reservation = Reservation::with('location', 'user')->where('id', $request->input('0.pivot.reservation_id'))->first();

            for ($i=0; $i < count($request->all()); $i++) {
                $this->validate($request, [
                    $i.'.equipment_id' => 'required',
                    $i.'.pivot' => 'required',
                ]);

                $duplicate = ReservationEquipment::where('approved', true)->where('equipment_id', $request->input($i.'.pivot.equipment_id'))->whereHas('reservation', function($query) use($reservation){
                    $start = Carbon::parse($reservation->start);
                    $end = Carbon::parse($reservation->end);

                    $query->where(function($query) use ($start, $end){
                        // in between approved reservation
                        $query->where('start', '<=', $start)->where('end', '>=', $end);
                        // overlap on start of approved reservation
                        $query->orWhereBetween('start', [$start, $end]);
                        // overlap on end of approved reservation
                        $query->orWhereBetween('end', [$start, $end]);
                    });
                })->first();

                if($duplicate)
                {
                    abort(422, 'Equipment has conflict with other reservation.');
                }

                $reservation_equipment = ReservationEquipment::find($request->input($i.'.pivot.id'));

                $reservation_equipment->equipment_id = $request->input($i.'.equipment_id');
                $reservation_equipment->approved = true;

                $reservation_equipment->save();
            }

            $reservation->equipment_approver_id = $request->user()->id;

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
     * Check equipment for conflict schedule.
     *
     * @return \Illuminate\Http\Response
     */
    public function checkDuplicate(Request $request)
    {
        $reservation = Reservation::find($request->input('pivot.reservation_id'));

        $duplicate = ReservationEquipment::where('approved', true)->where('equipment_id', $request->input('pivot.equipment_id'))->whereHas('reservation', function($query) use($reservation){
            $start = Carbon::parse($reservation->start);
            $end = Carbon::parse($reservation->end);

            $query->where(function($query) use ($start, $end){
                // in between approved reservation
                $query->where('start', '<=', $start)->where('end', '>=', $end);
                // overlap on start of approved reservation
                $query->orWhereBetween('start', [$start, $end]);
                // overlap on end of approved reservation
                $query->orWhereBetween('end', [$start, $end]);
            });
        })->first();

        return response()->json($duplicate ? true : false);
    }

    /**
     * Display a listing of the resource with parameters.
     *
     * @return \Illuminate\Http\Response
     */
    public function enlist(Request $request)
    {
        $reservation_equipment = ReservationEquipment::query();

        if($request->has('with'))
        {
            for ($i=0; $i < count($request->with); $i++) { 
                if(!$request->input('with')[$i]['withTrashed'])
                {
                    $reservation_equipment->with($request->input('with')[$i]['relation']);
                }
            }
        }

        if($request->has('where'))
        {
            for ($i=0; $i < count($request->where); $i++) { 
                $reservation_equipment->where($request->input('where')[$i]['label'], $request->input('where')[$i]['condition'], $request->input('where')[$i]['value']);
            }
        }

        if($request->has('first'))
        {
            return $reservation_equipment->first();
        }

        return $reservation_equipment->get();
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
        //
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
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
