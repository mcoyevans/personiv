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
        	['name' => 'posts', 'description' => 'Create a post.', 'super_admin_action' => false],
            ['name' => 'reservations', 'description' => 'Make a room reservation.', 'super_admin_action' => false],
        	['name' => 'approvals', 'description' => 'Manage approvals for reservations.', 'super_admin_action' => true],
            ['name' => 'manage-groups', 'description' => 'Manage user groups.', 'super_admin_action' => true],
        	['name' => 'manage-users', 'description' => 'Manage own group users.', 'super_admin_action' => true],
        	['name' => 'manage-locations', 'description' => 'Manage locations for reservations.', 'super_admin_action' => true],
        	['name' => 'manage-equipment', 'description' => 'Manage equipment for reservation.', 'super_admin_action' => true],
        	['name' => 'manage-links', 'description' => 'Manage local app links.', 'super_admin_action' => true],
        ]);
    }
}
