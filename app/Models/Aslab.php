<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Aslab extends Authenticatable
{
    use HasUuids;
    protected $table = 'aslab';
    protected $primaryKey = 'id';
    protected $guarded = ['id'];
    protected $casts = [
        'aktif' => 'boolean',
    ];
}
