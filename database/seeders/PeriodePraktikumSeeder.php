<?php

namespace Database\Seeders;

use App\Models\PeriodePraktikum;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PeriodePraktikumSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        PeriodePraktikum::create([
            'id' => Str::uuid(),
            'nama' => 'XXXVIII'
        ]);
        PeriodePraktikum::create([
            'id' => Str::uuid(),
            'nama' => 'XXXIX'
        ]);
        PeriodePraktikum::create([
            'id' => Str::uuid(),
            'nama' => 'XXXV'
        ]);
        PeriodePraktikum::create([
            'id' => Str::uuid(),
            'nama' => 'XXXVI'
        ]);
        PeriodePraktikum::create([
            'id' => Str::uuid(),
            'nama' => 'XXXVII'
        ]);
    }
}
