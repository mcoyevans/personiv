<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->call(GroupsTableSeeder::class);
        $this->call(LocationsTableSeeder::class);
        $this->call(LinksTableSeeder::class);
        $this->call(UsersTableSeeder::class);
        $this->call(RolesTableSeeder::class);
        $this->call(UserRolesTableSeeder::class);
        $this->call(EquipmentTypesTableSeeder::class);
        $this->call(SlideshowsTableSeeder::class);
        $this->call(SlidesTableSeeder::class);
        // $this->call(PostsTableSeeder::class);
        // $this->call(HashtagsTableSeeder::class);
        // $this->call(CommentsTableSeeder::class);
        // $this->call(ReservationsTableSeeder::class);
        // $this->call(EquipmentTableSeeder::class);
    }
}
