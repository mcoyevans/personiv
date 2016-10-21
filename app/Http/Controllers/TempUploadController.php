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

class TempUploadController extends Controller
{
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
