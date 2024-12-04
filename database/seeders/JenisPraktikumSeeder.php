<?php

namespace Database\Seeders;

use App\Models\JenisPraktikum;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class JenisPraktikumSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        JenisPraktikum::create([
            'id' => Str::uuid(),
            'nama' => 'Sistem Operasi'
        ]);
        JenisPraktikum::create([
            'id' => Str::uuid(),
            'nama' => 'Jaringan Komputer'
        ]);
    }
}
