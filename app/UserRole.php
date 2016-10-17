<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class UserRole extends Model
{
    public function user()
    {
    	return $this->belongTo('App\User');
    }

    public function role()
    {
    	return $this->belongTo('App\Role');
    }
}
