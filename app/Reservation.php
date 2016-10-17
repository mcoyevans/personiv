<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Reservation extends Model
{
    use SoftDeletes;

    protected $dates = ['deleted_at'];

    public function user()
    {
    	return $this->belongsTo('App\User');
    }

    public function equipments()
    {
    	return $this->belongsToMany('App\Equipment', 'reservation_equipments');
    }

    public function location()
    {
        return $this->belongsTo('App\Location');
    }
}
