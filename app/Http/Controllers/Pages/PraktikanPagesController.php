<?php

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use App\Models\Aslab;
use App\Models\BanList;
use App\Models\Kuis;
use App\Models\Praktikan;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PraktikanPagesController extends Controller
{
    public function loginPage()
    {
        return Inertia::render('Praktikan/PraktikanLoginPage');
    }
    public function dashboardPage()
    {
        $kuis = Kuis::with(['pertemuan.praktikum:id,nama'])
            ->where('waktu_mulai', '>', Carbon::now('Asia/Jakarta'))
            ->orderBy('waktu_mulai', 'asc')
            ->get(['id', 'nama', 'waktu_mulai', 'waktu_selesai', 'pertemuan_id']);

        return Inertia::render('Praktikan/PraktikanDashboardPage', [
            'aslabs' => fn() => Aslab::select('nama', 'npm', 'jabatan')->where('aktif', '=', true)->orderBy('npm','asc')->orderBy('created_at', 'desc')->get(),
            'kuis' => fn() => $kuis->map(function ($item) {
                return [
                    'id' => $item->id,
                    'nama' => $item->nama,
                    'waktu_mulai' => $item->waktu_mulai,
                    'waktu_selesai' => $item->waktu_selesai,
                    'praktikum' => [
                        'id' => $item->pertemuan->praktikum->id,
                        'nama' => $item->pertemuan->praktikum->nama,
                    ],
                ];
            }),
            'praktikums' => fn() => Praktikan::with('praktikum:id,nama')->get(['id', 'nama']),
        ]);
    }
    public function profilePage()
    {
        $authPraktikan = Auth::guard('praktikan')->user();
        if (!$authPraktikan) {
            abort(401);
        }
        return Inertia::render('Praktikan/PraktikanProfilePage', [
            'praktikan' => fn() => Praktikan::select('id','nama','npm','username','jenis_kelamin','avatar')->where('id', $authPraktikan->id)->first(),
        ]);
    }
    public function banListPage()
    {
        $authPraktikan = Auth::guard('praktikan')->user();
        if (!$authPraktikan) {
            abort(401);
        }

        $isBanned = BanList::where('praktikan_id', $authPraktikan->id)->first();

        if (!$isBanned) {
            abort(403);
        }

        return Inertia::render('BanListPage', [
            'banList' => fn() => $isBanned
        ]);
    }
}
