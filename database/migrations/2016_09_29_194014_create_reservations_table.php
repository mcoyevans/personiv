<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateReservationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->string('title');
            $table->text('remarks')->nullable();
            $table->integer('location_id')->unsigned();
            $table->integer('user_id')->unsigned();
            $table->timestamp('start');
            $table->timestamp('end')->nullable();
            $table->boolean('allDay');
            $table->boolean('approved_schedule');
            $table->boolean('approved_equipments');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('reservations');
    }
}
