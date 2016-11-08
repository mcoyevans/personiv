<?php

use Illuminate\Database\Seeder;

class ReservationsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('reservations')->insert([
        	[
        		'title' => 'All day reservation',
                'remarks' => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nesciunt quis consequuntur quasi odio voluptates molestias, placeat, esse cum repellat provident praesentium molestiae quod, aperiam dolor ducimus illum. Molestiae, hic, unde.',
        		'location_id' => 1,
        		'start' => Carbon\Carbon::today(),
        		'end' => null,
        		'user_id' => 1,
        		'allDay' => true,
                'approved_schedule' => true,
        		'approved_equipments' => true,
        		'created_at' => Carbon\Carbon::now(),
        		'updated_at' => Carbon\Carbon::now()
        	],
        	[
        		'title' => '1 Hour reservation',
                'remarks' => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nesciunt quis consequuntur quasi odio voluptates molestias, placeat, esse cum repellat provident praesentium molestiae quod, aperiam dolor ducimus illum. Molestiae, hic, unde.',
        		'location_id' => 2,
        		'start' => Carbon\Carbon::now(),
        		'end' => Carbon\Carbon::now()->addHour(),
        		'user_id' => 1,
        		'allDay' => false,
                'approved_schedule' => true,
        		'approved_equipments' => true,
        		'created_at' => Carbon\Carbon::now(),
        		'updated_at' => Carbon\Carbon::now()
        	]
        ]);
    }
}
