<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\Reservation;
use App\EquipmentType;
use App\User;

use App\Notifications\ReservationCreated;

use Auth;
use Carbon\Carbon;
use DB;
use Gate;
use Notification;

class ReservationController extends Controller
{
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
            $reservations->whereBetween($request->input('whereBetween.label'), [Carbon::parse($request->input('whereBetween.start')), Carbon::parse($request->input('whereBetween.end'))->addDay()]);   
        }
        else{
            $reservations->whereBetween('start', [Carbon::parse('first day of this month'), Carbon::parse('first day of next month')]);   
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

        DB::transaction(function() use($request){
            $reservation = new Reservation;

            $reservation->title = $request->title;
            $reservation->remarks = $request->remarks;
            $reservation->location_id = $request->location_id;
            $reservation->user_id = $request->user()->id;
            $reservation->start = Carbon::parse($request->date_start .' '. $request->time_start)->toDateTimeString();

            if(Carbon::parse($request->date_start .' '. $request->time_start)->gt(Carbon::parse($request->date_end .' '. $request->time_end)))
            {
                abort(422, 'End date cannot be earlier than start date');
            }

            $reservation->end = Carbon::parse($request->date_end .' '. $request->time_end)->toDateTimeString();
            $reservation->allDay = $request->has('allDay') ? true : false;

            $reservation->save();

            $reservation->load('user');

            if($request->has('equipment_types'))
            {
                for ($i=0; $i < count($request->equipment_types); $i++) { 
                    $reservation->equipment_types()->save(EquipmentType::find($request->input('equipment_types')[$i]['id']), ['approved' => false]);
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
