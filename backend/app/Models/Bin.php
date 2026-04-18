<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bin extends Model
{
    use HasFactory;

    protected $fillable = [
        'fill_level',
        'manual_open_command',
        'is_online'
    ];

    protected $casts = [
        'manual_open_command' => 'boolean',
        'is_online' => 'boolean',
        'fill_level' => 'integer',
    ];
}
