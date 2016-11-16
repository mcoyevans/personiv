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
Route::resource('temp-upload', 'TempUploadController');
Route::resource('reservation', 'ReservationController');
Route::resource('repost', 'RepostController');
Route::resource('reservation-equipment', 'ReservationEquipmentController');
Route::resource('role', 'RoleController');
Route::resource('user', 'UserController');
Route::resource('user-role', 'UserRoleController');

Route::post('/pusher/auth', 'PusherController@auth');

/* User Routes */
Route::group(['prefix' => 'user'], function(){
	Route::post('check', 'UserController@check');
	Route::post('check-email', 'UserController@checkEmail');
	Route::post('change-password', 'UserController@changePassword');
	Route::post('check-password', 'UserController@checkPassword');
	Route::post('enlist', 'UserController@enlist');
	Route::post('logout', 'UserController@logout');
	Route::post('mark-all-as-read', 'UserController@markAllAsRead');
	Route::post('mark-as-read', 'UserController@markAsRead');
	Route::post('notifications', 'UserController@notifications');
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

/* Location */
Route::group(['prefix' => 'location'], function(){
	Route::post('enlist', 'LocationController@enlist');
	Route::post('check-duplicate', 'LocationController@checkDuplicate');
});

/* Role */
Route::group(['prefix' => 'role'], function(){
	Route::post('enlist', 'RoleController@enlist');
});

/* User Role */
Route::group(['prefix' => 'user-role'], function(){
	Route::post('enlist', 'UserRoleController@enlist');
});

/* Post */
Route::group(['prefix' => 'post'], function(){
	Route::post('enlist', 'PostController@enlist');
	Route::get('photo/{postID}', 'PostController@photo');
	Route::get('temp/{path}', 'PostController@temp');
});

/* Comment */
Route::group(['prefix' => 'comment'], function(){
	Route::post('enlist', 'CommentController@enlist');
});

/* Temp Upload */
Route::group(['prefix' => 'temp-upload'], function(){
	Route::post('upload-photo', 'TempUploadController@uploadPhoto');
	Route::post('cancel-upload', 'TempUploadController@cancelUpload');
});

/* Repost */
Route::group(['prefix' => 'repost'], function(){
	Route::post('enlist', 'RepostController@enlist');
});

/* Reservation */
Route::group(['prefix' => 'reservation'], function(){
	Route::post('approve', 'ReservationController@approve');
	Route::post('decline', 'ReservationController@decline');
	Route::post('enlist', 'ReservationController@enlist');
	Route::post('check-duplicate', 'ReservationController@checkDuplicate');
});

/* Reservation Equipment*/
Route::group(['prefix' => 'reservation-equipment'], function(){
	Route::post('enlist', 'ReservationEquipmentController@enlist');
	Route::post('check-duplicate', 'ReservationEquipmentController@checkDuplicate');
	Route::post('approve', 'ReservationEquipmentController@approve');
});