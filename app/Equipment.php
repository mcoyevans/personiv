<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Equipment extends Model
{
    use SoftDeletes;

    protected $dates = ['deleted_at'];

    public function reservations()
    {
    	return $this->belongsToMany('App\Reservation', 'reservation_equipments');
    }

    public function equipment_type()
    {
    	return $this->belongsTo('App\EquipmentType');
    }
}
