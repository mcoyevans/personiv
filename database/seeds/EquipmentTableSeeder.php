<?php

use Illuminate\Database\Seeder;

class EquipmentTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('equipment')->insert([
        	[
        		'brand' => 'Mic',
        		'model' => 'Mic',
        		'asset_tag' => 'PITD00001',
        		'equipment_type_id' => 1,
        		'created_at' => Carbon\Carbon::now(),
        		'updated_at' => Carbon\Carbon::now(),
        	],
        	[
        		'brand' => 'Speaker',
        		'model' => 'Speaker',
        		'asset_tag' => 'PITD00002',
        		'equipment_type_id' => 2,
        		'created_at' => Carbon\Carbon::now(),
        		'updated_at' => Carbon\Carbon::now(),
        	],
        ]);
    }
}
