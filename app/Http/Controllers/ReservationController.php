<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\Reservation;

use Auth;
use Carbon\Carbon;
use DB;
use Gate;

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
