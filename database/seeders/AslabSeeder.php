<?php

namespace Database\Seeders;

use App\Models\Aslab;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Faker\Factory as Faker;

class AslabSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('id_ID');
        $data = [
            [
                'nama' => 'Mochamad Luthfan Rianda Putra',
                'npm' => '06.2021.1.07397',
                'username' => 'pann',
                'jabatan' => 'Koordinator'
            ],
            [
                'nama' => 'Indy Adira Khalfani',
                'npm' => '06.2021.1.07434',
                'username' => 'viole',
                'jabatan' => 'Admin'
            ],
            [
                'nama' => 'Latiful Sirri',
                'npm' => '06.2021.1.07461',
                'username' => 'vain',
                'jabatan' => 'Hardware-Software'
            ],
            [
                'nama' => 'Chatarina Natassya Putri',
                'npm' => '06.2021.1.07482',
                'username' => 'nat',
                'jabatan' => 'Sekretaris'
            ],
            [
                'nama' => 'Afzal Musyaffa Lathif Ashrafil Adam',
                'npm' => '06.2022.1.07587',
                'username' => 'afgood',
                'jabatan' => 'Koordinator'
            ],
            [
                'nama' => 'Windi Nitasya Lubis',
                'npm' => '06.2022.1.07590',
                'username' => 'windi',
                'jabatan' => 'Admin'
            ],
            [
                'nama' => 'Marikh Kasiful Izzat',
                'npm' => '06.2022.1.07610',
                'username' => 'tazz',
                'jabatan' => 'Koordinator'
            ],
            [
                'nama' => 'Gregoria Stefania Kue Siga',
                'npm' => '06.2022.1.07626',
                'username' => 'greiss',
                'jabatan' => 'Bendahara'
            ],
        ];
        $aslabs = array_map(function ($aslab) use ($faker) {
            return [
                'id' => Str::uuid(),
                'nama' => $aslab['nama'],
                'npm' => $aslab['npm'],
                'no_hp' => $faker->randomElement(['0857','0812','0858','0898','0838']).$faker->numerify('########'),
                'username' => $aslab['username'],
                'password' => Hash::make($aslab['username'], [ 'rounds' => 12 ]),
                'jabatan' => $aslab['jabatan'],
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }, $data);

        Aslab::insert($aslabs);
    }
}
