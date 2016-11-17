<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Hashtag extends Model
{
	protected $touches = ['post'];

	protected $fillable = ['tag'];

    public function post()
    {
    	return $this->belongsTo('App\Post');
    }
}
