<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ReservationEquipment extends Model
{
    protected $touches = ['reservation'];

    public function equipment()
    {
    	return $this->belongsTo('App\Equipment');
    }

    public function reservation()
    {
    	return $this->belongsTo('App\Reservation');
    }
}
