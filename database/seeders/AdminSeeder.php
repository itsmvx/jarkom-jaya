<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Admin::create([
            'id' => Str::uuid(),
            'nama' => 'Admin 1',
            'username' => 'admin1',
            'password' => Hash::make('123', [ 'rounds' => 12 ]),
        ]);
        Admin::create([
            'id' => Str::uuid(),
            'nama' => 'Admin 2',
            'username' => 'admin2',
            'password' => Hash::make('123', [ 'rounds' => 12 ]),
        ]);
    }
}
