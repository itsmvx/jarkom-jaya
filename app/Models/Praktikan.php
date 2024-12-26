<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Praktikan extends Authenticatable
{
    use HasUuids;
    protected $table = 'praktikan';
    protected $primaryKey = 'id';
    protected $guarded = ['id'];

    public function praktikum(): BelongsToMany
    {
        return $this->belongsToMany(Praktikum::class, 'praktikum_praktikan', 'praktikan_id', 'praktikum_id');
    }
}
