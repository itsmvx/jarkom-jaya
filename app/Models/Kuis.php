<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Kuis extends Model
{
    use HasUuids;
    protected $table = 'kuis';
    protected $primaryKey = 'id';
    protected $guarded = ['id'];
}
