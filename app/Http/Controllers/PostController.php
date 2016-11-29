<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\Post;
use App\Repost;
use App\Hashtag;
use App\User;

use App\Notifications\PostCreated;

use Auth;
use Carbon\Carbon;
use DB;
use Gate;
use Notification;
use Storage;

class PostController extends Controller
{
    /**
     * Repond the image of the post.
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
                if($request->input('with')[$i]['relation'] == 'repost.post')
                {
                    $posts->with([$request->input('with')[$i]['relation'] => function($query){
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
                    $posts->with($request->input('with')[$i]['relation']);
                }
                else{
                    $posts->with([$request->input('with')[$i]['relation'] => function($query){ 
                        $query->withTrashed();
                    }]);
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

        if($request->has('where'))
        {
            for ($i=0; $i < count($request->where); $i++) { 
                $posts->where($request->input('where')[$i]['label'], $request->input('where')[$i]['condition'], $request->input('where')[$i]['value']);
            }
        }

        if($request->has('whereNull'))
        {
            for ($i=0; $i < count($request->whereNull); $i++) { 
                $posts->whereNull($request->input('whereNull')[$i]);
            }   
        }

        if($request->has('orderBy'))
        {
            for ($i=0; $i < count($request->orderBy); $i++) { 
                $posts->orderBy($request->input('orderBy')[$i]['column'], $request->input('orderBy')[$i]['order']);
            }
        }

        if($request->has('search'))
        {
            $posts->where('title', 'like', '%'. $request->search .'%')->orWhere('body', 'like', '%'. $request->search .'%')->orWhereHas('hashtags', function($query) use ($request){
                $query->where('tag', $request->search);
            });
        }

        if(Auth::check())
        {
            if(!$request->user()->super_admin)
            {
                $posts->where('group_id', $request->user()->group_id)->orWhereNull('group_id');
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
        if(!Gate::forUser($request->user())->allows('posts'))
        {
            abort(403, 'Unauthorized action.');
        }

        $this->validate($request, [
            'title' => 'required',
            'body' => 'required',
            'group_id' => 'required',
        ]);


        DB::transaction(function() use($request){
            $post = new Post;

            $post->title = $request->title;
            $post->body = $request->body;
            $post->url = $request->url;
            $post->allow_comments = $request->allow_comments ? true : false;
            $post->group_id = $request->group_id == 'all' ? null : $request->group_id;
            $post->user_id = $request->user()->id;

            $post->save();

            $post->load('user');

            if($request->has('chips'))
            {
                $hashtags = array();

                foreach ($request->chips as $item) {
                    $hashtag = new Hashtag(['tag' => $item]);

                    array_push($hashtags, $hashtag);
                }

                $post->hashtags()->saveMany($hashtags);
            }

            if($request->has('image_path'))
            {
                $post->image_path = 'posts/'. Carbon::now()->toDateString(). '-'. $post->id . '-'. str_random(16) . '.jpg';

                Storage::copy($request->image_path, $post->image_path);

                Storage::delete($request->image_path);

                $post->save();
            }

            $users = $post->group_id ? User::whereNotIn('id', [$request->user()->id])->where('group_id', $post->group_id)->get() : User::whereNotIn('id', [$request->user()->id])->get();

            Notification::send($users, new PostCreated($post));
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
        return Post::withTrashed()->where('id', $id)->first();
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
        $this->authorize('update', Post::find($id));

        $this->validate($request, [
            'title' => 'required',
            'body' => 'required',
            'group_id' => 'required',
        ]);


        DB::transaction(function() use($request, $id){
            $post = Post::find($id);

            $post->title = $request->title;
            $post->body = $request->body;
            $post->url = $request->url;
            $post->allow_comments = $request->allow_comments ? true : false;
            $post->group_id = $request->group_id == 'all' ? null : $request->group_id;

            $post->save();

            $hashtags = Hashtag::where('post_id', $id)->delete();

            if($request->has('chips'))
            {
                $hashtags = array();

                foreach ($request->chips as $item) {
                    $hashtag = new Hashtag(['tag' => $item]);

                    array_push($hashtags, $hashtag);
                }

                $post->hashtags()->saveMany($hashtags);
            }

            if(!$request->has('image_path'))
            {
                Storage::delete($post->image_path);

                $post->image_path = null;

                $post->save();
            }

            if($request->has('image_path') && $request->image_path != $post->image_path)
            {
                $post->image_path = 'posts/'. Carbon::now()->toDateString(). '-'. $post->id . '-'. str_random(16) . '.jpg';

                Storage::copy($request->image_path, $post->image_path);

                Storage::delete($request->image_path);

                $post->save();
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
        $post = Post::with('repost')->where('id', $id)->first();

        $this->authorize('delete', $post);

        if($post->repost_id)
        {
            Repost::where('id', $post->repost_id)->delete();
        }    

        $post->delete();
    }
}
