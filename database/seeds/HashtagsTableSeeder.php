<?php

use Illuminate\Database\Seeder;

class HashtagsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('hashtags')->insert([
        	['tag' => 'test', 'post_id' => 1, 'created_at' => Carbon\Carbon::now(), 'updated_at' => Carbon\Carbon::now()],
        	['tag' => 'sample', 'post_id' => 1, 'created_at' => Carbon\Carbon::now(), 'updated_at' => Carbon\Carbon::now()],
        	['tag' => 'awesome', 'post_id' => 1, 'created_at' => Carbon\Carbon::now(), 'updated_at' => Carbon\Carbon::now()],
        ]);
    }
}
