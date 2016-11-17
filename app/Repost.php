<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Repost extends Model
{
    use SoftDeletes;

    protected $dates = ['deleted_at'];

    public function post()
    {
    	return $this->belongsTo('App\Post');
    }

	public function user()
    {
    	return $this->belongsTo('App\User');
    }

    public function group()
    {
    	return $this->belongsTo('App\Group');
    }
}
