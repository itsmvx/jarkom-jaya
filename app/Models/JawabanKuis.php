<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class JawabanKuis extends Model
{
    use HasUuids;

    protected $table = 'jawaban_kuis';
    protected $guarded = ['id'];

    public function soalKuis()
    {
        return $this->belongsTo(SoalKuis::class, 'soal_kuis_id');
    }
}
