<?php

namespace Database\Seeders;

use App\Models\Label;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class LabelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $labels = ['Modul 1', 'Modul 2', 'Modul 3', 'Modul 4', 'Pre-Test', 'Welcome', 'Ez', 'Hard', 'Yapping', 'Sistem Operasi', 'Jaringan Komputer', 'Rev.2019'];

        foreach ($labels as $label) {
            Label::create([
                'id' => Str::uuid(),
                'nama' => $label,
            ]);
        }
    }
}
