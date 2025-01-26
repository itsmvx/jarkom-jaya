<?php

namespace Database\Seeders;

use App\Models\Modul;
use App\Models\Pertemuan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ModulSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $pertemuanList = Pertemuan::all();

        foreach ($pertemuanList as $pertemuan) {
            for ($i = 1; $i <= 8; $i++) {
                Modul::create([
                    'id' => Str::uuid(),
                    'nama' => "ModulPraktikum $i",
                    'topik' => "Topik modul $i",
                    'pertemuan_id' => $pertemuan->id,
                ]);
            }
        }
    }
}
