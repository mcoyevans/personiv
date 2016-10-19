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
Route::resource('equipment-type', 'EquipmentTypeController');
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

/* User Routes */
Route::group(['prefix' => 'user'], function(){
	Route::post('check', 'UserController@check');
	Route::post('check-email', 'UserController@checkEmail');
	Route::post('change-password', 'UserController@changePassword');
	Route::post('check-password', 'UserController@checkPassword');
	Route::post('enlist', 'UserController@enlist');
	Route::post('logout', 'UserController@logout');
	Route::post('upload-avatar/{userID}', 'UserController@uploadAvatar');
	Route::get('avatar/{userID}', 'UserController@avatar');
});

/* Equipment */
Route::group(['prefix' => 'equipment'], function(){
	Route::post('enlist', 'EquipmentController@enlist');
	Route::post('check-duplicate', 'EquipmentController@checkDuplicate');
});

/* Equipment Type */
Route::group(['prefix' => 'equipment-type'], function(){
	Route::post('enlist', 'EquipmentTypeController@enlist');
	Route::post('check-duplicate', 'EquipmentTypeController@checkDuplicate');
});

/* Group */
Route::group(['prefix' => 'group'], function(){
	Route::post('enlist', 'GroupController@enlist');
	Route::post('check-duplicate', 'GroupController@checkDuplicate');
});

/* Link */
Route::group(['prefix' => 'link'], function(){
	Route::post('enlist', 'LinkController@enlist');
	Route::post('check-duplicate', 'LinkController@checkDuplicate');
});