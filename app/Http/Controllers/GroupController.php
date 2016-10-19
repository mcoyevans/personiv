<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\Group;

use Auth;
use DB;
use Gate;
use Carbon\Carbon;

class GroupController extends Controller
{
    /**
     * Checks for duplicate bank account number entry.
     *
     * @return bool
     */
    public function checkDuplicate(Request $request)
    {
        $duplicate = $request->has('id') ? Group::where('name', $request->name)->whereNotIn('id', [$request->id])->first() : Group::where('name', $request->name)->first();

        return response()->json($duplicate ? true : false);
    }

    /**
     * Display a listing of the resource with parameters.
     *
     * @return \Illuminate\Http\Response
     */
    public function enlist(Request $request)
    {
        $groups = Group::query();

        if($request->has('withTrashed'))
        {
            $groups->withTrashed();
        }

        if($request->has('with'))
        {
            for ($i=0; $i < count($request->with); $i++) { 
                if(!$request->input('with')[$i]['withTrashed'])
                {
                    $groups->with($request->input('with')[$i]['relation']);
                }
            }
        }

        if($request->has('withCount'))
        {
            for ($i=0; $i < count($request->withCount); $i++) { 
                if(!$request->input('withCount')[$i]['withTrashed'])
                {
                    $groups->withCount($request->input('withCount')[$i]['relation']);
                }
            }
        }

        if($request->has('where'))
        {
            for ($i=0; $i < count($request->where); $i++) { 
                $groups->where($request->input('where')[$i]['label'], $request->input('where')[$i]['condition'], $request->input('where')[$i]['value']);
            }
        }

        if($request->has('search'))
        {
            $groups->where('name', 'like', '%'.$request->search.'%');
        }

        if($request->has('paginate'))
        {
            return $groups->paginate($request->paginate);
        }

        if($request->has('first'))
        {
            return $groups->first();
        }

        return $groups->get();
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Group::all();
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
        if(!Gate::forUser($request->user())->allows('manage-groups'))
        {
            abort(403, 'Unauthorized action.');
        }

        $duplicate = Group::where('name', $request->name)->first();

        $this->validate($request, [
            'name' => 'required',
        ]);

        DB::transaction(function() use($request){
            $group = new Group;

            $group->name = $request->name;

            $group->save();
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
        return Group::withTrashed()->where('id', $id)->first();
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
        if(!Gate::forUser($request->user())->allows('manage-groups'))
        {
            abort(403, 'Unauthorized action.');
        }

        $duplicate = Group::whereNotIn('id', [$id])->where('name', $request->name)->first();

        $this->validate($request, [
            'name' => 'required',
        ]);

        DB::transaction(function() use($request, $id){
            $group = Group::where('id', $id)->first();

            $group->name = $request->name;
            
            $group->save();
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
        if(!Gate::forUser(Auth::user())->allows('manage-groups'))
        {
            abort(403, 'Unauthorized action.');
        }

        $group = Group::withCount('users')->where('id', $id)->first();

        if(!$group->users_count)
        {
            $group->delete();

            return;
        }

        abort(403, 'Unable to delete.');
    }
}
