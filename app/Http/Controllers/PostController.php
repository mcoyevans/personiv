<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\Post;

use Auth;
use Carbon\Carbon;
use DB;
use Gate;
use Storage;

class PostController extends Controller
{
    /**
     * Display a listing of the resource with parameters.
     *
     * @return \Illuminate\Http\Response
     */
    public function photo($id)
    {
        $post = Post::where('id', $id)->first();

        return response()->file(storage_path() .'/app/'. $post->image_path);
    }
    /**
     * Display a listing of the resource with parameters.
     *
     * @return \Illuminate\Http\Response
     */
    public function enlist(Request $request)
    {
        $posts = Post::query();

        if($request->has('with'))
        {
            for ($i=0; $i < count($request->with); $i++) { 
                if(!$request->input('with')[$i]['withTrashed'])
                {
                    $posts->with($request->input('with')[$i]['relation']);
                }
            }
        }

        if($request->has('withCount'))
        {
            for ($i=0; $i < count($request->withCount); $i++) { 
                if(!$request->input('withCount')[$i]['withTrashed'])
                {
                    $posts->withCount($request->input('withCount')[$i]['relation']);
                }
            }
        }

        if(!$request->user()->super_admin)
        {
            $posts->where('group_id', $request->user()->group_id)->orWhereNull('group_id');
        }

        if($request->has('where'))
        {
            for ($i=0; $i < count($request->where); $i++) { 
                $posts->where($request->input('where')[$i]['label'], $request->input('where')[$i]['condition'], $request->input('where')[$i]['value']);
            }
        }

        if($request->has('orderBy'))
        {
            for ($i=0; $i < count($request->orderBy); $i++) { 
                $posts->orderBy($request->input('orderBy')[$i]['column'], $request->input('orderBy')[$i]['order']);
            }
        }

        if($request->has('first'))
        {
            return $posts->first();
        }

        if($request->has('paginate'))
        {
            return $posts->paginate($request->paginate);
        }

        return $posts->get();
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Post::all();
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
