<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\Birthday;

use Auth;
use Carbon\Carbon;
use DB;
use Gate;

class BirthdayController extends Controller
{
    /**
     * Checks for duplicate bank account number entry.
     *
     * @return bool
     */
    public function checkDuplicate(Request $request)
    {
        $duplicate = $request->has('id') ? Birthday::where('employee_number', $request->employee_number)->whereNotIn('id', [$request->id])->first() : Birthday::where('employee_number', $request->employee_number)->first();

        return response()->json($duplicate ? true : false);
    }

    /**
     * Display a listing of the resource with parameters.
     *
     * @return \Illuminate\Http\Response
     */
    public function enlist(Request $request)
    {
        $birthdays = Birthday::query();

        if($request->has('withTrashed'))
        {
            $birthdays->withTrashed();
        }

        if($request->has('where'))
        {
            for ($i=0; $i < count($request->where); $i++) { 
                $birthdays->where($request->input('where')[$i]['label'], $request->input('where')[$i]['condition'], $request->input('where')[$i]['value']);
            }
        }

        if($request->has('search'))
        {
            $birthdays->where('first_name', 'like', '%'.$request->search.'%')->orWhere('middle_name', 'like', '%'.$request->search.'%')->orWhere('last_name', 'like', '%'.$request->search.'%');
        }

        if($request->has('paginate'))
        {
            return $birthdays->paginate($request->paginate);
        }

        if($request->has('first'))
        {
            return $birthdays->first();
        }

        return $birthdays->get();
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
        if(Gate::forUser(Auth::user())->denies('manage-birthdays'))
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
        if(Gate::forUser($request->user())->denies('manage-birthdays'))
        {
            abort(403, 'Unauthorized action.');
        }

        $duplicate = Birthday::where('employee_number', $request->employee_number)->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        $birthday = new Birthday;

        $birthday->employee_number = $request->employee_number;
        $birthday->first_name = $request->first_name;
        $birthday->middle_name = $request->middle_name;
        $birthday->last_name = $request->last_name;
        $birthday->lob = $request->lob;
        $birthday->birthdate = Carbon::parse($request->birthdate);

        $birthday->save();
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return Birthday::find($id);
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
        if(Gate::forUser($request->user())->denies('manage-birthdays'))
        {
            abort(403, 'Unauthorized action.');
        }

        $duplicate = Birthday::whereNotIn('id', [$id])->where('employee_number', $request->employee_number)->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        $birthday = Birthday::find($id);

        $birthday->employee_number = $request->employee_number;
        $birthday->first_name = $request->first_name;
        $birthday->middle_name = $request->middle_name;
        $birthday->last_name = $request->last_name;
        $birthday->lob = $request->lob;
        $birthday->birthdate = Carbon::parse($request->birthdate);

        $birthday->save();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        Birthday::where('id', $id)->delete();
    }
}
