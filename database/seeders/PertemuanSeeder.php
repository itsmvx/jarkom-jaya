<?php

namespace Database\Seeders;

use App\Models\Pertemuan;
use App\Models\Praktikum;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PertemuanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $praktikumList = Praktikum::all();

        foreach ($praktikumList as $praktikum) {
            for ($i = 1; $i <= 4; $i++) {
                Pertemuan::create([
                    'id' => Str::uuid(),
                    'nama' => "Pertemuan $i",
                    'praktikum_id' => $praktikum->id,
                ]);
            }
        }
    }
}
