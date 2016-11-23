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
                'name' => 'Marco Paco',
                'email' => 'marco.paco@personiv.com',
                'password' => bcrypt('admin222526'),
                'group_id' => 1,
                'super_admin' => true, 
                'position' => 'IT Programmer', 
                'created_at' => Carbon\Carbon::now(), 
                'updated_at' => Carbon\Carbon::now()
            ],
            // [
            //     'name' => 'John Doe',
            //     'email' => 'john.doe@personiv.com',
            //     'password' => bcrypt('!welcome10'),
            //     'group_id' => 2,
            //     'super_admin' => true, 
            //     'position' => 'Admin Staff', 
            //     'created_at' => Carbon\Carbon::now(), 
            //     'updated_at' => Carbon\Carbon::now()
            // ]
        ]);
    }
}
