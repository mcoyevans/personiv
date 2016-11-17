<?php

use Illuminate\Database\Seeder;

class LinksTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('links')->insert([
            ['name' => 'Inventory', 'link' => 'http://172.17.0.210:86', 'created_at' => Carbon\Carbon::now(), 'updated_at' => Carbon\Carbon::now()],
        	['name' => 'Jeonsoft', 'link' => 'http://empkiosk.personiv.com/', 'created_at' => Carbon\Carbon::now(), 'updated_at' => Carbon\Carbon::now()],
        	['name' => 'Policy Repository', 'link' => 'http://172.17.0.210:85' , 'created_at' => Carbon\Carbon::now(), 'updated_at' => Carbon\Carbon::now()],
        	['name' => 'Productivity Quality Report', 'link' => 'http://172.17.0.210:83', 'created_at' => Carbon\Carbon::now(), 'updated_at' => Carbon\Carbon::now()],
        	['name' => 'Revolve', 'link' => 'http://172.17.0.210:90', 'created_at' => Carbon\Carbon::now(), 'updated_at' => Carbon\Carbon::now() ],
        	['name' => 'Ticketing', 'link' => 'http://172.17.0.205/support', 'created_at' => Carbon\Carbon::now(), 'updated_at' => Carbon\Carbon::now()],
        ]);
    }
}
