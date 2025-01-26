<?php

namespace Database\Seeders;

use App\Models\JenisPraktikum;
use App\Models\PeriodePraktikum;
use App\Models\Praktikum;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PraktikumSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jenisPraktikum = JenisPraktikum::all();
        $periodePraktikum = PeriodePraktikum::all();

        foreach ($jenisPraktikum as $jenis) {
            foreach ($periodePraktikum as $periode) {
                Praktikum::create([
                    'id' => Str::uuid(),
                    'nama' => "{$jenis->nama} {$periode->nama}",
                    'tahun' => 2025,
                    'status' => false,
                    'jenis_praktikum_id' => $jenis->id,
                    'periode_praktikum_id' => $periode->id,
                ]);
            }
        }
    }
}
