<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Soal extends Model
{
    use HasUuids;
    protected $table = 'soal';
    protected $primaryKey = 'id';
    protected $guarded = ['id'];

    public function label()
    {
        return $this->belongsToMany(Label::class, 'label_soal', 'soal_id', 'label_id');
    }
}
