<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\Post;
use App\Repost;
use App\User;

use App\Notifications\RepostCreated;

use Auth;
use Carbon\Carbon;
use DB;
use Gate;
use Notification;

class RepostController extends Controller
{
    /**
     * Display a listing of the resource with parameters.
     *
     * @return \Illuminate\Http\Response
     */
    public function enlist(Request $request)
    {
        $reposts = Repost::query();

        if($request->has('with'))
        {
            for ($i=0; $i < count($request->with); $i++) { 
                if($request->input('with')[$i]['relation'] == 'post')
                {
                    $reposts->with([$request->input('with')[$i]['relation'] => function($query){
                        $query->with('hashtags');
                        
                        $query->with(['user' => function($query){
                            $query->withTrashed();
                        }]);

                        $query->with(['group' => function($query){
                            $query->withTrashed();
                        }]);
                    }]);
                    
                    continue;
                }

                if(!$request->input('with')[$i]['withTrashed'])
                {
                    $reposts->with($request->input('with')[$i]['relation']);
                }
                else{
                    $reposts->with([$request->input('with')[$i]['relation'] => function($query){ 
                        $query->withTrashed();
                    }]);
                }
            }
        }

        if($request->has('where'))
        {
            for ($i=0; $i < count($request->where); $i++) { 
                $reposts->where($request->input('where')[$i]['label'], $request->input('where')[$i]['condition'], $request->input('where')[$i]['value']);
            }
        }

        if($request->has('orderBy'))
        {
            for ($i=0; $i < count($request->orderBy); $i++) { 
                $reposts->orderBy($request->input('orderBy')[$i]['column'], $request->input('orderBy')[$i]['order']);
            }
        }

        if($request->has('first'))
        {
            return $reposts->first();
        }

        if($request->has('paginate'))
        {
            return $reposts->paginate($request->paginate);
        }

        return $reposts->get();
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
        if(!Gate::forUser($request->user())->allows('posts'))
        {
            abort(403, 'Unauthorized action.');
        }

        $this->validate($request, [
            'group_id' => 'required',
            'post' => 'required',
        ]);

        DB::transaction(function() use($request){
            $repost = new Repost;

            $repost->post_id = $request->input('post.id');
            $repost->user_id = $request->user()->id;

            $repost->save();

            $post = new Post();

            $post->title = $request->title;
            $post->allow_comments = $request->allow_comments ? true : false;
            $post->group_id = $request->input('post.group_id') ? $request->input('post.group_id') : ($request->group_id == 'all' ? null : $request->group_id);
            $post->user_id = $request->user()->id;
            $post->repost_id = $repost->id;
           
            $post->save();

            $users = $post->group_id ? User::whereNotIn('id', [$request->user()->id])->where('group_id', $post->group_id)->get() : User::whereNotIn('id', [$request->user()->id])->get();

            $repost->load('post.user');
            $post->load('user');

            Notification::send($users, new RepostCreated($post, $repost->post));
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
        $repost = Repost::with('post')->where('id', $request->id)->first();

        $this->authorize('update', $repost);

        $this->validate($request, [
            'group_id' => 'required',
        ]);

        $post = Post::find($id);

        DB::transaction(function() use($request, $post){
            $post->title = $request->title;
            $post->allow_comments = $request->allow_comments ? true : false;
            $post->group_id = $request->input('post.group_id') ? $request->input('post.group_id') : ($request->group_id == 'all' ? null : $request->group_id);
           
            $post->save();
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
        //
    }
}
