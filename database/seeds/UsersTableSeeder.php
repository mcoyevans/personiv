<?php

use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert([
            [
                'name' => 'Facilities Admin',
                'email' => 'admin.ind@personiv.com',
                'password' => bcrypt('!welcome17'),
                'group_id' => 2,
                'super_admin' => true, 
                'position' => 'Reservations Approver', 
                'created_at' => Carbon\Carbon::now(), 
                'updated_at' => Carbon\Carbon::now()
            ],
        ]);
    }
}
