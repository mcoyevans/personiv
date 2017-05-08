<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\TempUpload;

use Auth;
use Carbon\Carbon;
use DB;
use Gate;
use Storage;
use Image;

class TempUploadController extends Controller
{
    /**
     * Delete slide photo.
     *
     * @return \Illuminate\Http\Response
     */
    public function deleteSlide(Request $request)
    {
        if(Gate::forUser($request->user())->denies('slideshow'))
        {
            abort(403, 'Unauthorized action');
        }

        TempUpload::where('path', $request->path)->delete();

        Storage::delete($request->path);
    }

    /**
     * Cancel upload photo.
     *
     * @return \Illuminate\Http\Response
     */
    public function cancelUpload(Request $request)
    {
        if(!Gate::forUser($request->user())->allows('posts'))
        {
            abort(403, 'Unauthorized action');
        }

        Storage::delete($request->path);
    }

    /**
     * Upload form file.
     *
     * @return \Illuminate\Http\Response
     */
    public function uploadFile(Request $request)
    {
        if(Gate::forUser($request->user())->denies('manage-forms'))
        {
            abort(403, 'Unauthorized action');
        }

        $path = Storage::putFile('temp', $request->file('file'));

        return response()->json($path);
    }

    /**
     * Upload post photo.
     *
     * @return \Illuminate\Http\Response
     */
    public function uploadPhoto(Request $request)
    {
        if(!Gate::forUser($request->user())->allows('posts'))
        {
            abort(403, 'Unauthorized action');
        }

        $path = Storage::putFile('temp', $request->file('file'));

        Image::make(Storage::get($path))->resize(null, 360, function($constraint){
            $constraint->aspectRatio();
            $constraint->upsize();
        })->save(storage_path() .'/app/'. $path);

        $temp_upload = new TempUpload;

        $temp_upload->path = $path;

        $temp_upload->save();

        return $temp_upload;
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
        $temp_upload = TempUpload::where('id', $id)->first();

        return response()->file(storage_path() .'/app/'. $temp_upload->path);
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
