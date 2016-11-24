<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use Pusher;

class PusherController extends Controller
{
    public function auth(Request $request)
    {
    	$pusher = new Pusher('0521fe41d7482726355c', 'bb83b0ac81fb9d12d190', '253851');
    	
    	echo $pusher->socket_auth($request->channel_name, $request->socket_id);
    }
}
