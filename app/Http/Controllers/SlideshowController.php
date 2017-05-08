<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\Slideshow;
use App\Slide;
use App\User;

use App\Notifications\SlideshowCreated;
use App\Notifications\SlideshowUpdated;

use Auth;
use Carbon\Carbon;
use DB;
use Gate;
use Notification;
use Storage;

class SlideshowController extends Controller
{
    public function enlist(Request $request)
    {
        $slideshows = Slideshow::query();

        if($request->has('with'))
        {
            for ($i=0; $i < count($request->with); $i++) { 
                if(!$request->input('with')[$i]['withTrashed'])
                {
                    $slideshows->with($request->input('with')[$i]['relation']);
                }
                else{
                    $slideshows->with([$request->input('with')[$i]['relation'] => function($query){ 
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
                    $slideshows->withCount($request->input('withCount')[$i]['relation']);
                }
            }
        }

        if($request->has('first'))
        {
            return $slideshows->first();
        }

        if($request->has('paginate'))
        {
            return $slideshows->paginate($request->paginate);
        }

        return $slideshows->get();
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
        if(!Gate::forUser(Auth::user())->allows('slideshow'))
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
        if(Gate::forUser($request->user())->denies('slideshow'))
        {
            abort(403, 'Unauthorized access.');
        }

        $this->validate($request, [
            'slides' => 'required'
        ]);

        $current = Slideshow::whereNull('deleted_at');

        $current->delete();

        DB::transaction(function() use($request){        

            $slideshow = new Slideshow;

            $slideshow->title = $request->title;
            $slideshow->description = $request->description;

            $slideshow->save();

            $slides = array();

            for ($i=0; $i < count($request->slides); $i++) { 
                $this->validate($request, [
                    'slides.'.$i.'.path' => 'required',
                    'slides.'.$i.'.order' => 'required',
                ]);

                $slide = new Slide([
                    'description' => isset($request->input('slides')[$i]['description']) ? $request->input('slides')[$i]['description'] : null,
                    'order' => $request->input('slides')[$i]['order'],
                    'path' => 'slides/'. Carbon::now()->toDateString(). '-'. $slideshow->id . '-'. str_random(16) . '.jpg',
                ]);

                Storage::copy($request->input('slides')[$i]['path'], $slide->path);

                array_push($slides, $slide);
            }

            $slideshow->slides()->saveMany($slides);

            Notification::send(User::where('super_admin', 1)->get(), new SlideshowCreated($slideshow, $request->user()));
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
        if(Gate::forUser($request->user())->denies('slideshow'))
        {
            abort(403, 'Unauthorized access.');
        }

        DB::transaction(function() use($request, $id){        
            $slideshow = Slideshow::with('slides')->where('id', $id)->first();

            $slideshow->title = $request->title;
            $slideshow->description = $request->description;

            $slideshow->save();

            $slides = array();

            for ($i=0; $i < count($request->slides); $i++) { 
                $this->validate($request, [
                    'slides.'.$i.'.path' => 'required',
                    'slides.'.$i.'.order' => 'required',
                ]);

                if(!isset($request->input('slides')[$i]['slideshow_id']))
                {
                    $slide = new Slide([
                        'description' => isset($request->input('slides')[$i]['description']) ? $request->input('slides')[$i]['description'] : null,
                        'order' => $request->input('slides')[$i]['order'],
                        'path' => 'slides/'. Carbon::now()->toDateString(). '-'. $slideshow->id . '-'. str_random(16) . '.jpg',
                    ]);

                    Storage::copy($request->input('slides')[$i]['path'], $slide->path);

                    array_push($slides, $slide);
                }
                else{
                    $slide = Slide::find($request->input('slides')[$i]['id']);

                    $slide->description = isset($request->input('slides')[$i]['description']) ? $request->input('slides')[$i]['description'] : null;
                    $slide->order = $request->input('slides')[$i]['order'];

                    $slide->save();
                }
            }

            if(count($slides))
            {
                $slideshow->slides()->saveMany($slides);
            }

            Notification::send(User::where('super_admin', 1)->get(), new SlideshowUpdated($slideshow, $request->user()));
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
