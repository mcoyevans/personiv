<?php

use Illuminate\Database\Seeder;

class EquipmentTypesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('equipment_types')->insert([
        	['name' => 'Microphone', 'created_at' => Carbon\Carbon::now(), 'updated_at' => Carbon\Carbon::now()],
        	['name' => 'Speaker', 'created_at' => Carbon\Carbon::now(), 'updated_at' => Carbon\Carbon::now()],
        ]);
    }
}
