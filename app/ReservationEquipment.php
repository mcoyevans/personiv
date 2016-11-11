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

    public function equipment_type()
    {
    	return $this->belongsTo('App\EquipmentType');
    }

    public function reservation()
    {
    	return $this->belongsTo('App\Reservation');
    }
}
