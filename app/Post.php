<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Post extends Model
{
    use SoftDeletes;

    protected $dates = ['deleted_at'];

    public function group()
    {
    	return $this->belongsTo('App\Group');
    }

    public function hashtags()
    {
    	return $this->hasMany('App\Hastag');
    }
}
