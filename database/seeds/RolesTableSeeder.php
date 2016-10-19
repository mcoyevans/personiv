<?php

use Illuminate\Database\Seeder;

class RolesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('roles')->insert([
        	['name' => 'posts'],
            ['name' => 'reservations'],
        	['name' => 'approvals'],
            ['name' => 'manage-groups'],
        	['name' => 'manage-users'],
        	['name' => 'manage-locations'],
        	['name' => 'manage-equipments'],
        	['name' => 'manage-links'],
        ]);
    }
}
