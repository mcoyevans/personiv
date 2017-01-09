<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeEmployeeNumberUniqueFromBirthdaysTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('birthdays', function (Blueprint $table) {
            $table->integer('employee_number')->unsigned()->change();
            $table->string('suffix')->nullable();
            $table->dropColumn('deleted_at');
            $table->engine = 'InnoDB';
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('birthdays', function (Blueprint $table) {
            // 
        });
    }
}
