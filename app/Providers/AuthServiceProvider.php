<?php

namespace App\Providers;

use App\User;

use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        'App\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        Gate::define('posts', function($user){
            $user = User::with('roles')->where('id', $user->id)->first();

            foreach ($user->roles as $role) {
                if($role->name == 'posts')
                {
                    return true;
                }
            }

            return false;
        });

        Gate::define('reservations', function($user){
            $user = User::with('roles')->where('id', $user->id)->first();

            foreach ($user->roles as $role) {
                if($role->name == 'reservations')
                {
                    return true;
                }
            }

            return false;
        });

        Gate::define('manage-groups', function($user){
            $user = User::with('roles')->where('id', $user->id)->first();

            foreach ($user->roles as $role) {
                if($role->name == 'manage-groups')
                {
                    return true;
                }
            }

            return false;
        });

        Gate::define('manage-users', function($user){
            $user = User::with('roles')->where('id', $user->id)->first();

            foreach ($user->roles as $role) {
                if($role->name == 'manage-users')
                {
                    return true;
                }
            }

            return false;
        });

        Gate::define('manage-locations', function($user){
            $user = User::with('roles')->where('id', $user->id)->first();

            foreach ($user->roles as $role) {
                if($role->name == 'manage-locations')
                {
                    return true;
                }
            }

            return false;
        });

        Gate::define('manage-equipments', function($user){
            $user = User::with('roles')->where('id', $user->id)->first();

            foreach ($user->roles as $role) {
                if($role->name == 'manage-equipments')
                {
                    return true;
                }
            }

            return false;
        });

        Gate::define('manage-links', function($user){
            $user = User::with('roles')->where('id', $user->id)->first();

            foreach ($user->roles as $role) {
                if($role->name == 'manage-links')
                {
                    return true;
                }
            }

            return false;
        });      
    }
}
