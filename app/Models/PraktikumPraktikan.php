<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PraktikumPraktikan extends Model
{
    use HasUuids;
    protected $table = 'praktikum_praktikan';
    protected $primaryKey = 'id';
    protected $guarded = ['id'];

    public function praktikum(): BelongsTo
    {
        return $this->belongsTo(Praktikum::class, 'praktikum_id');
    }

    public function praktikan(): BelongsTo
    {
        return $this->belongsTo(Praktikan::class, 'praktikan_id');
    }
}
