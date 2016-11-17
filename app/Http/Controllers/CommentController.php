<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\Post;
use App\Comment;

use App\Notifications\CommentCreated;

use Auth;
use Carbon\Carbon;
use DB;
use Gate;
use Notification;

class CommentController extends Controller
{
    /**
     * Display a listing of the resource with parameters.
     *
     * @return \Illuminate\Http\Response
     */
    public function enlist(Request $request)
    {
        $comments = Comment::query();

        if($request->has('with'))
        {
            for ($i=0; $i < count($request->with); $i++) { 
                if(!$request->input('with')[$i]['withTrashed'])
                {
                    $comments->with($request->input('with')[$i]['relation']);
                }
                else{
                    $comments->with([$request->input('with')[$i]['relation'] => function($query){
                        $query->withTrashed();
                    }]);
                }
            }
        }

        if($request->has('where'))
        {
            for ($i=0; $i < count($request->where); $i++) { 
                $comments->where($request->input('where')[$i]['label'], $request->input('where')[$i]['condition'], $request->input('where')[$i]['value']);
            }
        }

        $comments->orderBy('created_at', 'desc');

        if($request->has('first'))
        {
            return $comments->first();
        }

        if($request->has('paginate'))
        {
            return $comments->paginate($request->paginate);
        }

        return $comments->get();
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
        $post = Post::find($request->id);

        if($post->group_id && !$request->user()->super_admin)
        {
            $this->authorize('comment', $post);
        }

        $this->validate($request, [
            'id' => 'required|numeric',
            'new_comment' => 'required',
        ]);

        $comment = new Comment;

        DB::transaction(function() use($request, $post, $comment){
            $comment->message = $request->new_comment;
            $comment->post_id = $request->id;
            $comment->user_id = $request->user()->id;

            $comment->save();

            $comment->load('user');

            if($post->user_id != $request->user()->id)
            {
                $post->load('user');

                $post->user->notify(new CommentCreated($comment));
            }
        });

        return $comment;
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
        $this->authorize('update', Comment::find($id));

        $this->validate($request, [
            'new_message' => 'required',
        ]);

        $comment = Comment::where('id', $id)->first();

        DB::transaction(function() use($request, $comment){
            $comment->message = $request->new_message;

            $comment->save();
        });

        return $comment;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $comment = Comment::with('post')->where('id', $id)->first();

        $this->authorize('delete', $comment);

        $comment->delete();
    }
}
