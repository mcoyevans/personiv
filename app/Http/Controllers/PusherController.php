<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use Pusher;

class PusherController extends Controller
{
    public function auth(Request $request)
    {
    	$pusher = new Pusher('73a46f761ea4637481b5', '5c3f50ca95b3f8bb5fa5', '253849');
    	
    	echo $pusher->socket_auth($request->channel_name, $request->socket_id);
    }
}
