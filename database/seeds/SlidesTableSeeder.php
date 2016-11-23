<?php

use Illuminate\Database\Seeder;

class SlidesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('slides')->insert([
        	[
        		'description' => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus animi cupiditate et velit minus esse temporibus. Voluptatum vel placeat corporis, alias ipsam adipisci pariatur saepe, deserunt inventore. Inventore, eum, totam.',
        		'path' => 'sample/StockSnap_7JYS1YN2IQ.jpg',
                'slideshow_id' => 1,
                'order' => 1,
                'created_at' => Carbon\Carbon::now(),
                'updated_at' => Carbon\Carbon::now()
            ],
            [
                'description' => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus animi cupiditate et velit minus esse temporibus. Voluptatum vel placeat corporis, alias ipsam adipisci pariatur saepe, deserunt inventore. Inventore, eum, totam.',
                'path' => 'sample/StockSnap_O9ZLQJRP1H.jpg',
                'slideshow_id' => 1,
                'order' => 2,
        		'created_at' => Carbon\Carbon::now(),
        		'updated_at' => Carbon\Carbon::now()
        	],
        ]);
    }
}
