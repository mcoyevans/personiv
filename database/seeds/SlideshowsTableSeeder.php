<?php

use Illuminate\Database\Seeder;

class SlideshowsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('slideshows')->insert([
        	'title' => 'Action buttons',
        	'description' => 'The titles of Washed Out\'s breakthrough song and the first single from Paracosm share the two most important words in Ernest Greene\'s musical language: feel it. It\'s a simple request, as well...',
        	'created_at' => Carbon\Carbon::now(),
        	'updated_at' => Carbon\Carbon::now()
        ]);
    }
}
