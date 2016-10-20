<?php

use Illuminate\Database\Seeder;

class PostsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('posts')->insert([
        	'title' => 'Action buttons',
        	'message' => 'The titles of Washed Out\'s breakthrough song and the first single from Paracosm share the two most important words in Ernest Greene\'s musical language: feel it. It\'s a simple request, as well...',
        	'image_path' => 'sample/washedout',
        	'pinned' => true,
        	'allow_comments' => true,
        	'user_id' => 1,
        	'published_at' => Carbon\Carbon::now(),
        	'created_at' => Carbon\Carbon::now(),
        	'updated_at' => Carbon\Carbon::now(),
        ]);
    }
}
