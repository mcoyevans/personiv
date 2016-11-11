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
        		'end' => Carbon\Carbon::tomorrow()->subSecond(),
        		'user_id' => 1,
        		'allDay' => true,
                'schedule_approver_id' => 2,
        		'equipment_approver_id' => 1,
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
                'schedule_approver_id' => 2,
        		'equipment_approver_id' => 1,
        		'created_at' => Carbon\Carbon::now(),
        		'updated_at' => Carbon\Carbon::now()
        	],
            [
                'title' => 'Pending reservation',
                'remarks' => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nesciunt quis consequuntur quasi odio voluptates molestias, placeat, esse cum repellat provident praesentium molestiae quod, aperiam dolor ducimus illum. Molestiae, hic, unde.',
                'location_id' => 3,
                'start' => Carbon\Carbon::now(),
                'end' => Carbon\Carbon::now()->addHour(),
                'user_id' => 1,
                'allDay' => false,
                'schedule_approver_id' => null,
                'equipment_approver_id' => null,
                'created_at' => Carbon\Carbon::now(),
                'updated_at' => Carbon\Carbon::now()
            ],
            [
                'title' => 'Pending reservation',
                'remarks' => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nesciunt quis consequuntur quasi odio voluptates molestias, placeat, esse cum repellat provident praesentium molestiae quod, aperiam dolor ducimus illum. Molestiae, hic, unde.',
                'location_id' => 3,
                'start' => Carbon\Carbon::now(),
                'end' => Carbon\Carbon::now()->addHour(),
                'user_id' => 1,
                'allDay' => false,
                'schedule_approver_id' => null,
                'equipment_approver_id' => null,
                'created_at' => Carbon\Carbon::now(),
                'updated_at' => Carbon\Carbon::now()
            ],
        ]);
    }
}
