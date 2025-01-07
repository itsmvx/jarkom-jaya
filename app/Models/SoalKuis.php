<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class SoalKuis extends Model
{
    use HasUuids;

    protected $table = 'soal_kuis';
    protected $guarded = ['id'];
}
