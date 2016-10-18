<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\EquipmentType;

use Auth;
use Carbon\Carbon;
use DB;
use Gate;

class EquipmentTypeController extends Controller
{
    /**
     * Checks for duplicate bank account number entry.
     *
     * @return bool
     */
    public function checkDuplicate(Request $request)
    {
        if($request->has('name'))
        {
            $duplicate = $request->has('id') ? EquipmentType::where('name', $request->name)->whereNotIn('id', [$request->id])->first() : EquipmentType::where('name', $request->name)->first();

            return response()->json($duplicate ? true : false);
        }
    }
    /**
     * Display a listing of the resource with parameters.
     *
     * @return \Illuminate\Http\Response
     */
    public function enlist(Request $request)
    {
        $equipment_types = EquipmentType::query();

        if($request->has('with'))
        {
            for ($i=0; $i < count($request->with); $i++) { 
                if(!$request->input('with')[$i]['withTrashed'])
                {
                    $equipment_types->with($request->input('with')[$i]['relation']);
                }
            }
        }

        if($request->has('withCount'))
        {
            for ($i=0; $i < count($request->withCount); $i++) { 
                if(!$request->input('withCount')[$i]['withTrashed'])
                {
                    $equipment_types->withCount($request->input('withCount')[$i]['relation']);
                }
            }
        }

        if($request->has('where'))
        {
            for ($i=0; $i < count($request->where); $i++) { 
                $equipment_types->where($request->input('where')[$i]['label'], $request->input('where')[$i]['condition'], $request->input('where')[$i]['value']);
            }
        }

        if($request->has('search'))
        {
            $equipment_types->where('brand', 'like', '%'.$request->search.'%')->orWhere('model', 'like', '%'.$request->search.'%')->orWhere('asset_tag', 'like', '%'.$request->search.'%');
        }

        if($request->has('paginate'))
        {
            return $equipment_types->paginate($request->paginate);
        }

        if($request->has('first'))
        {
            return $equipment_types->first();
        }

        return $equipment_types->get();
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return EquipmentType::all();
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
        if(!Gate::forUser($request->user())->allows('manage-equipments'))
        {
            abort(403, 'Unauthorized action.');
        }

        $duplicate = EquipmentType::where('name', $request->name)->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        $this->validate($request, [
            'name' => 'required',
        ]);


        DB::transaction(function() use ($request) {
            $equipment_type = new EquipmentType;

            $equipment_type->name = $request->name;

            $equipment_type->save();
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
        return EquipmentType::where('id', $id)->first();
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

        $duplicate = EquipmentType::whereNotIn('id', [$id])->where('name', $request->name)->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        $this->validate($request, [
            'name' => 'required',
        ]);


        DB::transaction(function() use ($request, $id) {
            $equipment_type = EquipmentType::where('id', $id)->first();

            $equipment_type->name = $request->name;

            $equipment_type->save();
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

        $equipment_type = EquipmentType::withCount('equipments')->where('id', $id)->first();

        if(!$equipment_type->equipments_count)
        {
            $equipment_type->delete();

            return;
        }

        abort(403, 'Unable to delete.');
    }
}
