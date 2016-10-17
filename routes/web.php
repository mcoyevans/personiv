<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| This file is where you may define all of the routes that are handled
| by your application. Just tell Laravel the URIs it should respond
| to using a Closure or controller method. Build something great!
|
*/

Route::get('/', function () {
    return view('wall');
});

Auth::routes();

/* Determines what type of user then returns the appropriate views*/
Route::get('/home', 'HomeController@home');

// Route resource
Route::resource('comment', 'CommentController');
Route::resource('equipment', 'EquipmentController');
Route::resource('group', 'GroupController');
Route::resource('hashtag', 'HashtagController');
Route::resource('link', 'LinkController');
Route::resource('location', 'LocationController');
Route::resource('post', 'PostController');
Route::resource('reservation', 'ReservationController');
Route::resource('reservation-equipment', 'ReservationEquipmentController');
Route::resource('role', 'RoleController');
Route::resource('user', 'UserController');
Route::resource('user-role', 'UserRoleController');

