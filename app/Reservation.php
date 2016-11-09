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

    public function schedule_approver()
    {
        return $this->belongsTo('App\User', 'schedule_approver_id');
    }

    public function equipment_approver()
    {
        return $this->belongsTo('App\User', 'equipment_approver_id');
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
