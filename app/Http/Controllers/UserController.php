<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\User;
use Auth;
use DB;
use Hash;
use Gate;
use Storage;

class UserController extends Controller
{
    /**
     * View user avatar and upload new avatar.
     *
     * @return \Illuminate\Http\Response
     */
    public function avatar($id)
    {
        $user = User::withTrashed()->where('id', $id)->first();

        return response()->file(storage_path() .'/app/'. $user->avatar_path);
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

        $user = User::where('id', $request->user()->id)->first();

        if($user->avatar_path)
        {
            Storage::delete($user->avatar_path);
        }

        $path = Storage::putFileAs('avatars', $request->file('file'), $request->user()->id);

        $user->avatar_path = $path;

        $user->save();

        return $user->avatar_path;
    }

    /**
     * Display a listing of the resource with parameters.
     *
     * @return \Illuminate\Http\Response
     */
    public function enlist(Request $request)
    {
        $users = User::query();

        if($request->has('withTrashed'))
        {
            $users->withTrashed();
        }

        if($request->has('with'))
        {
            for ($i=0; $i < count($request->with); $i++) { 
                if(!$request->input('with')[$i]['withTrashed'])
                {
                    $users->with($request->input('with')[$i]['relation']);
                }
            }
        }

        if(!$request->user()->super_admin)
        {
            $users->where('group_id', $request->user()->group_id);
        }

        if($request->has('where'))
        {
            for ($i=0; $i < count($request->where); $i++) { 
                $users->where($request->input('where')[$i]['label'], $request->input('where')[$i]['condition'], $request->input('where')[$i]['value']);
            }
        }

        if($request->has('search'))
        {
            $users->where('name', 'like', '%'.$request->search.'%')->orWhere('email', 'like', '%'.$request->search.'%');
        }

        if($request->has('paginate'))
        {
            return $users->paginate($request->paginate);
        }

        if($request->has('first'))
        {
            return $users->first();
        }

        return $users->get();
    }

    /**
     * Checks authenticated user.
     *
     * @return \Illuminate\Http\Response
     */
    public function check(Request $request)
    {
        $user = Auth::user();

        $user->unread_notifications = $user->unreadNotifications;

        $user->load('group', 'roles');

        return $user;
    }

    /**
     * Checks if the email is already taken.
     *
     * @return bool
     */
    public function checkEmail(Request $request)
    {
        $user = $request->id ? User::withTrashed()->whereNotIn('id', [$request->id])->where('email', $request->email)->first() : User::withTrashed()->where('email', $request->email)->first();

        return response()->json($user ? true : false);
    }
    
    /**
     * Changes the password of the authenticated user.
     *
     * @return \Illuminate\Http\Response
     */
    public function changePassword(Request $request)
    {
        $user = $request->user();

        if($request->new == $request->confirm && $request->old != $request->new)
        {
            $user->password = Hash::make($request->new);
        }

        $user->save();
    }

    /**
     * Check if the password of the authenticated user is the same with his new password.
     *
     * @return bool
     */
    public function checkPassword(Request $request)
    {
        return response()->json(Hash::check($request->old, $request->user()->password));
    }

    /**
     * Logout the authenticated user.
     *
     * @return \Illuminate\Http\Response
     */
    public function logout()
    {
        Auth::logout();
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
        if(!Gate::forUser(Auth::user())->allows('manage-users'))
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
        if(!Gate::forUser(Auth::user())->allows('manage-users'))
        {
            abort(403, 'Unauthorized action.');
        }

        $duplicate = User::withTrashed()->where('email', $request->email)->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        $this->validate($request, [
            'name' => 'required',
            'email' => 'required|unique:users',
            'password' => 'required',
            'position' => 'required',
        ]);

        DB::transaction(function() use($request){
            $user = new User;

            $user->name = $request->name;
            $user->email = $request->email;
            $user->password = bcrypt($request->password);
            $user->group_id = $request->group_id;
            $user->super_admin = false;
            $user->position = $request->position;

            $user->save();

            $roles = array();

            for ($i=0; $i < count($request->roles); $i++) { 
                if(isset($request->input('roles')[$i]['id']))
                {
                    array_push($roles, $request->input('roles')[$i]['id']);
                }
            }
            
            $user->roles()->attach($roles);
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
        return User::withTrashed()->where('id', $id)->first();
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
        if(!Gate::forUser(Auth::user())->allows('manage-users'))
        {
            abort(403, 'Unauthorized action.');
        }

        $duplicate = User::whereNotIn('id', [$id])->withTrashed()->where('email', $request->email)->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        $this->validate($request, [
            'name' => 'required',
            'position' => 'required',
        ]);

        DB::transaction(function() use($request, $id){
            $user = User::where('id', $id)->first();

            $user->name = $request->name;
            $user->group_id = $request->group_id;
            $user->position = $request->position;


            $user->save();

            $roles = array();

            for ($i=0; $i < count($request->roles); $i++) { 
                if(isset($request->input('roles')[$i]['id']))
                {
                    array_push($roles, $request->input('roles')[$i]['id']);
                }
            }
            
            $user->roles()->sync($roles);
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
        if(!Gate::forUser(Auth::user())->allows('manage-users') && !Auth::user()->super_admin)
        {
            abort(403, 'Unauthorized action.');
        }

        User::where('id', $id)->delete();
    }
}
