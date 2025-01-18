<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SesiPraktikum extends Model
{
    use HasUuids;
    protected $table = 'sesi_praktikum';
    protected $primaryKey = 'id';
    protected $guarded = ['id'];

    public function praktikum(): BelongsTo
    {
        return $this->BelongsTo(Praktikum::class, 'praktikum_id');
    }
}
