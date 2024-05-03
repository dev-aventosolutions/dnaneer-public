<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Notifications;
use Auth;

class NotificationController extends Controller
{

    public function get_latest_notification_admin(){
        $data = Notifications::where('is_admin', 1)->orderBy('created_at', 'desc')->get()->take(5);
        return response()->json([
         'status' => 'success',
         'data' => $data,
         ], 200);
     }

    public function get_admin_notifications(){
       $data = Notifications::with('user')->where('is_admin', 1)->orderBy('created_at', 'desc')->get();
       return response()->json([
        'status' => 'success',
        'data' => $data,
        ], 200);
    }

    public function get_latest_notification_user(){
        $user_id = Auth::id();
        $data = Notifications::with('user')->where('is_admin', 0)->where('user_id', $user_id)->orderBy('created_at', 'desc')->get()->take(5);
        return response()->json([
         'status' => 'success',
         'data' => $data,
         ], 200);
     }

     public function get_user_notifications(){
        $user_id = Auth::id();
        $data = Notifications::with('user')->where('is_admin', 0)->where('user_id', $user_id)->orderBy('created_at', 'desc')->get();
        return response()->json([
         'status' => 'success',
         'data' => $data,
         ], 200);
     }
}
