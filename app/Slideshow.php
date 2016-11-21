<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Slideshow extends Model
{
    use SoftDeletes;

    protected $dates = ['deleted_at'];

    public function slides()
    {
    	return $this->hasMany('App\Slide');
    }
}
