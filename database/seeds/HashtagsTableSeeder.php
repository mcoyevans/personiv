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
        	['tag' => '#test', 'post_id' => 1],
        	['tag' => '#sample', 'post_id' => 1],
        	['tag' => '#awesome', 'post_id' => 1],
        ]);
    }
}
