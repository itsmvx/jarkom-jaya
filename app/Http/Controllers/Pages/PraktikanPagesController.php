<?php

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use App\Models\Aslab;
use App\Models\BanList;
use App\Models\JenisPraktikum;
use App\Models\Kuis;
use App\Models\Praktikan;
use App\Models\Praktikum;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
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
    public function registerPage()
    {
        return Inertia::render('Praktikan/PraktikanRegistrationPage');
    }
    public function profilePage()
    {
        $authPraktikan = Auth::guard('praktikan')->user();
        if (!$authPraktikan) {
            abort(401);
        }

        $isBanned = BanList::where('praktikan_id', $authPraktikan->id)->latest('created_at')->first();

        if ($isBanned) {
            return Inertia::render('BanListPage', [
                'banList' => fn() => $isBanned
            ]);
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

        $isBanned = BanList::where('praktikan_id', $authPraktikan->id)->latest('created_at')->first();

        if (!$isBanned) {
            abort(403);
        }

        return Inertia::render('BanListPage', [
            'banList' => fn() => $isBanned
        ]);
    }

    public function praktikumIndexPage(Request $request)
    {
        $authPraktikan = Auth::guard('praktikan')->user();
        if (!$authPraktikan) {
            abort(401);
        }

        $search = $request->query->get('search');

        return Inertia::render('Praktikan/PraktikanPraktikumIndexPage', [
            'praktikums' => fn() => Praktikum::select([
                'praktikum.id',
                'praktikum.nama',
                'praktikum.tahun',
                'praktikum_praktikan.terverifikasi',
                'periode_praktikum.nama as periode_nama'
            ])
                ->join('praktikum_praktikan', 'praktikum.id', '=', 'praktikum_praktikan.praktikum_id')
                ->leftJoin('periode_praktikum', 'praktikum.periode_praktikum_id', '=', 'periode_praktikum.id')
                ->where('praktikum_praktikan.praktikan_id', $authPraktikan->id)
                ->when($search, function ($query, $search) {
                    $query->where('praktikum.nama', 'like', "%{$search}%");
                })
                ->get()
                ->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'nama' => $item->nama,
                        'tahun' => $item->tahun,
                        'terverifikasi' => (bool) $item->terverifikasi,
                        'periode' => $item->periode_nama ? ['nama' => $item->periode_nama] : null,
                    ];
                }),
        ]);
    }
    public function praktikumCreatePage(Request $request)
    {
        $authPraktikan = Auth::guard('praktikan')->user();
        if (!$authPraktikan) {
            abort(401);
        }

        return Inertia::render('Praktikan/PraktikanPraktikumCreatePage', [
            'jenisPraktikums' => JenisPraktikum::with(['praktikum' => function ($query) use ($authPraktikan) {
                $query->where('status', true)
                ->with(['periode'])
                    ->select([
                        'praktikum.*',
                        DB::raw("(NOT EXISTS (
                  SELECT 1 FROM praktikum_praktikan
                  WHERE praktikum_praktikan.praktikum_id = praktikum.id
                  AND praktikum_praktikan.praktikan_id = '$authPraktikan->id'
              )) as available")]);
            }])->get()
        ]);
    }
}
