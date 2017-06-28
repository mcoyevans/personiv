<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use Pusher;

class PusherController extends Controller
{
    public function auth(Request $request)
    {
    	$pusher = new Pusher(env('PUSHER_KEY'), env('PUSHER_SECRET'), env('PUSHER_APP_ID')));
    	
    	echo $pusher->socket_auth($request->channel_name, $request->socket_id);
    }
}
