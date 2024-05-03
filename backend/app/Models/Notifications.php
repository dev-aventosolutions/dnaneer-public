<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notifications extends Model
{
    use HasFactory;

    protected $table = 'notifications';
    public $timestamps = true;
    protected $fillable = [
        'user_id',
        'title',
        'text',
        'seen',
        'url',
        'is_admin'
    ];

    public function user() {
        return $this->hasOne('App\Models\User','id', 'user_id')->select('id','name');
    }
}
