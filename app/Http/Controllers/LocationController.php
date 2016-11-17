<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\Location;

use Auth;
use Carbon\Carbon;
use DB;
use Gate;

class LocationController extends Controller
{
    /**
     * Checks for duplicate bank account number entry.
     *
     * @return bool
     */
    public function checkDuplicate(Request $request)
    {
        $duplicate = $request->has('id') ? Location::where('name', $request->name)->whereNotIn('id', [$request->id])->first() : Location::where('name', $request->name)->first();

        return response()->json($duplicate ? true : false);
    }

    /**
     * Display a listing of the resource with parameters.
     *
     * @return \Illuminate\Http\Response
     */
    public function enlist(Request $request)
    {
        $locations = Location::query();

        if($request->has('withTrashed'))
        {
            $locations->withTrashed();
        }

        if($request->has('where'))
        {
            for ($i=0; $i < count($request->where); $i++) { 
                $locations->where($request->input('where')[$i]['label'], $request->input('where')[$i]['condition'], $request->input('where')[$i]['value']);
            }
        }

        if($request->has('search'))
        {
            $locations->where('name', 'like', '%'.$request->search.'%');
        }

        if($request->has('paginate'))
        {
            return $locations->paginate($request->paginate);
        }

        if($request->has('first'))
        {
            return $locations->first();
        }

        return $locations->get();
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Location::all();
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        if(!Gate::forUser(Auth::user())->allows('manage-locations'))
        {
            abort(403, 'Unauthorized action.');
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        if(!Gate::forUser($request->user())->allows('manage-locations'))
        {
            abort(403, 'Unauthorized action.');
        }

        $duplicate = Location::where('name', $request->name)->first();

        $this->validate($request, [
            'name' => 'required',
        ]);

        DB::transaction(function() use($request){
            $location = new Location;

            $location->name = $request->name;

            $location->save();
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
        return Location::withTrashed()->where('id', $id)->first();
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
        if(!Gate::forUser($request->user())->allows('manage-locations'))
        {
            abort(403, 'Unauthorized action.');
        }

        $duplicate = Location::whereNotIn('id', [$id])->where('name', $request->name)->first();

        $this->validate($request, [
            'name' => 'required',
        ]);

        DB::transaction(function() use($request, $id){
            $location = Location::where('id', $id)->first();

            $location->name = $request->name;

            $location->save();
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
        if(!Gate::forUser(Auth::user())->allows('manage-locations'))
        {
            abort(403, 'Unauthorized action.');
        }

        Location::where('id', $id)->delete();
    }
}
