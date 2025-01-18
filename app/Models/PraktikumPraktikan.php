<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PraktikumPraktikan extends Model
{
    use HasUuids;
    protected $table = 'praktikum_praktikan';
    protected $fillable = [
        'praktikan_id',
        'praktikum_id',
    ];
}
