<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Praktikan extends Authenticatable
{
    use HasUuids;
    protected $table = 'praktikan';
    protected $primaryKey = 'id';
    protected $guarded = ['id'];
    protected function nama(): Attribute
    {
        return Attribute::make(
            set: fn ($value) => ucwords(strtolower($value))
        );
    }
    public function praktikum(): BelongsToMany
    {
        return $this->belongsToMany(Praktikum::class, 'praktikum_praktikan', 'praktikan_id', 'praktikum_id');
    }
}
