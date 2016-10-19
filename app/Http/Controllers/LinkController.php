<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\Link;

use Auth;
use Carbon\Carbon;
use DB;
use Gate;

class LinkController extends Controller
{
    /**
     * Checks for duplicate bank account number entry.
     *
     * @return bool
     */
    public function checkDuplicate(Request $request)
    {
        $duplicate = $request->has('id') ? Link::where('link', $request->link)->whereNotIn('id', [$request->id])->first() : Link::where('link', $request->link)->first();

        return response()->json($duplicate ? true : false);
    }

    /**
     * Display a listing of the resource with parameters.
     *
     * @return \Illuminate\Http\Response
     */
    public function enlist(Request $request)
    {
        $links = Link::query();

        if($request->has('withTrashed'))
        {
            $links->withTrashed();
        }

        if($request->has('where'))
        {
            for ($i=0; $i < count($request->where); $i++) { 
                $links->where($request->input('where')[$i]['label'], $request->input('where')[$i]['condition'], $request->input('where')[$i]['value']);
            }
        }

        if($request->has('search'))
        {
            $links->where('name', 'like', '%'.$request->search.'%');
        }

        if($request->has('paginate'))
        {
            return $links->paginate($request->paginate);
        }

        if($request->has('first'))
        {
            return $links->first();
        }

        return $links->get();
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Link::all();
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
        if(!Gate::forUser($request->user())->allows('manage-links'))
        {
            abort(403, 'Unauthorized action.');
        }

        $duplicate = Link::where('link', $request->link)->first();

        $this->validate($request, [
            'name' => 'required',
            'link' => 'required',
        ]);

        DB::transaction(function() use($request){
            $link = new Link;

            $link->name = $request->name;
            $link->link = $request->link;

            $link->save();
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
        return Link::withTrashed()->where('id', $id)->first();
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
        if(!Gate::forUser($request->user())->allows('manage-links'))
        {
            abort(403, 'Unauthorized action.');
        }

        $duplicate = Link::whereNotIn('id', [$id])->where('link', $request->link)->first();

        $this->validate($request, [
            'name' => 'required',
            'link' => 'required',
        ]);

        DB::transaction(function() use($request, $id){
            $link = Link::where('id', $id)->first();

            $link->name = $request->name;
            $link->link = $request->link;
            
            $link->save();
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
        if(!Gate::forUser(Auth::user())->allows('manage-links'))
        {
            abort(403, 'Unauthorized action.');
        }

        Link::where('id', $id)->delete();
    }
}
