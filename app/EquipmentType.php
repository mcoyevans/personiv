<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class EquipmentType extends Model
{
    public function equipment()
    {
    	return $this->hasMany('App\Equipment');
    }

    public function reservations()
    {
    	return $this->belongsToMany('App\Reservation', 'reservation_equipments')->withTimestamps();;
    }
}
