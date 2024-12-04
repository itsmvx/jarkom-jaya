<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Praktikum extends Model
{
    use HasUuids;
    protected $table = 'praktikum';
    protected $primaryKey = 'id';
    protected $guarded = ['id'];

    public function jenis()
    {
        return $this->BelongsTo(JenisPraktikum::class, 'jenis_praktikum_id');
    }
    public function periode(): BelongsTo
    {
        return $this->belongsTo(PeriodePraktikum::class, 'periode_praktikum_id');
    }
}
