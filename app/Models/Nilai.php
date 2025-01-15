<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Nilai extends Model
{
    use HasUuids;
    protected $table = 'nilai';
    protected $primaryKey = 'id';
    protected $guarded = ['id'];

    public function praktikan(): BelongsTo
    {
        return $this->belongsTo(Praktikan::class, 'praktikan_id');
    }
}
