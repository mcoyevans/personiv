<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\Equipment;

use Auth;
use DB;
use Gate;
use Carbon\Carbon;

class EquipmentController extends Controller
{
    /**
     * Checks for duplicate bank account number entry.
     *
     * @return bool
     */
    public function checkDuplicate(Request $request)
    {
        $duplicate = $request->has('id') ? Equipment::where('asset_tag', $request->asset_tag)->where('equipment_type_id', $request->equipment_type_id)->whereNotIn('id', [$request->id])->first() : Equipment::where('asset_tag', $request->asset_tag)->where('equipment_type_id', $request->equipment_type_id)->first();

        return response()->json($duplicate ? true : false);
    }

    /**
     * Display a listing of the resource with parameters.
     *
     * @return \Illuminate\Http\Response
     */
    public function enlist(Request $request)
    {
        $equipments = Equipment::query();

        if($request->has('withTrashed'))
        {
            $equipments->withTrashed();
        }

        if($request->has('with'))
        {
            for ($i=0; $i < count($request->with); $i++) { 
                if(!$request->input('with')[$i]['withTrashed'])
                {
                    $equipments->with($request->input('with')[$i]['relation']);
                }
            }
        }

        if($request->has('withCount'))
        {
            for ($i=0; $i < count($request->withCount); $i++) { 
                if(!$request->input('withCount')[$i]['withTrashed'])
                {
                    $equipments->withCount($request->input('withCount')[$i]['relation']);
                }
            }
        }

        if($request->has('where'))
        {
            for ($i=0; $i < count($request->where); $i++) { 
                $equipments->where($request->input('where')[$i]['label'], $request->input('where')[$i]['condition'], $request->input('where')[$i]['value']);
            }
        }

        if($request->has('search'))
        {
            $equipments->where('brand', 'like', '%'.$request->search.'%')->orWhere('model', 'like', '%'.$request->search.'%')->orWhere('asset_tag', 'like', '%'.$request->search.'%');
        }

        if($request->has('paginate'))
        {
            return $equipments->paginate($request->paginate);
        }

        if($request->has('first'))
        {
            return $equipments->first();
        }

        return $equipments->get();
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Equipment::all();
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        if(!Gate::forUser(Auth::user())->allows('manage-equipments'))
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
        if(!Gate::forUser($request->user())->allows('manage-equipments'))
        {
            abort(403, 'Unauthorized action.');
        }

        $duplicate = Equipment::where('asset_tag', $request->asset_tag)->where('equipment_type_id', $request->equipment_type_id)->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        $this->validate($request, [
            'brand' => 'required',
            'model' => 'required',
            'equipment_type_id' => 'required|numeric',
            'asset_tag' => 'required',
        ]);


        DB::transaction(function() use ($request) {
            $equipment = new Equipment;

            $equipment->brand = $request->brand;
            $equipment->model = $request->model;
            $equipment->equipment_type_id = $request->equipment_type_id;
            $equipment->asset_tag = $request->asset_tag;

            $equipment->save();
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
        return Equipment::where('id', $id)->first();
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
        if(!Gate::forUser($request->user())->allows('manage-equipments'))
        {
            abort(403, 'Unauthorized action.');
        }

        $duplicate = Equipment::whereNotIn('id', [$id])->where('asset_tag', $request->asset_tag)->where('equipment_type_id', $request->equipment_type_id)->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        $this->validate($request, [
            'brand' => 'required',
            'model' => 'required',
            'equipment_type_id' => 'required|numeric',
            'asset_tag' => 'required',
        ]);


        DB::transaction(function() use ($request, $id) {
            $equipment = Equipment::where('id', $id)->first();

            $equipment->brand = $request->brand;
            $equipment->model = $request->model;
            $equipment->equipment_type_id = $request->equipment_type_id;
            $equipment->asset_tag = $request->asset_tag;

            $equipment->save();
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
        if(!Gate::forUser(Auth::user())->allows('manage-equipments'))
        {
            abort(403, 'Unauthorized action.');
        }

        Equipment::where('id', $id)->delete();
    }
}
