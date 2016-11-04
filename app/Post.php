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
    	return $this->hasMany('App\Hashtag');
    }

    public function comments()
    {
        return $this->hasMany('App\Comment');
    }

    public function user()
    {
        return $this->belongsTo('App\User');
    }

    public function repost()
    {
        return $this->belongsTo('App\Repost');
    }

    public function reposts()
    {
        return $this->hasMany('App\Repost');
    }
}
