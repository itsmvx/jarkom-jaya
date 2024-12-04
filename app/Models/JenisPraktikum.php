<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JenisPraktikum extends Model
{
    use HasUuids;
    protected $table = 'jenis_praktikum';
    protected $primaryKey = 'id';
    protected $guarded = ['id'];

    public function praktikum(): HasMany
    {
        return $this->hasMany(Praktikum::class, 'periode_praktikum_id');
    }
}
