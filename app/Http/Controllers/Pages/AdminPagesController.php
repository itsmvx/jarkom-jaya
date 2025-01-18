<?php

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use App\Models\Aslab;
use App\Models\JenisPraktikum;
use App\Models\Kuis;
use App\Models\Label;
use App\Models\PeriodePraktikum;
use App\Models\Praktikan;
use App\Models\Praktikum;
use App\Models\Soal;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminPagesController extends Controller
{
    public function loginPage()
    {
        return Inertia::render('Admin/AdminLoginPage');
    }
    public function dashboardPage()
    {
        $kuis = Kuis::with(['pertemuan.praktikum:id,nama'])
            ->where('waktu_mulai', '>', Carbon::now('Asia/Jakarta'))
            ->orderBy('waktu_mulai', 'asc')
            ->get(['id', 'nama', 'waktu_mulai', 'waktu_selesai', 'pertemuan_id']);

        return Inertia::render('Admin/AdminDashboardPage', [
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
        ]);
    }

    public function jenisPraktikumIndexPage(Request $request)
    {
        $viewList = [ "10", "25", "50", "100" ];
        $viewPerPage = $request->query('view');

        if (!in_array($viewPerPage, $viewList)) {
            $viewPerPage = 10;
        } else {
            $viewPerPage = intval($viewPerPage);
        }

        $query = JenisPraktikum::select('id', 'nama')->orderBy('created_at', 'desc');

        $search = $request->query('search');
        if ($search) {
            $query->where('nama', 'like', '%' . $search . '%');
        }

        $jenisPraktikums = $query->paginate($viewPerPage)->withQueryString();

        return Inertia::render('Admin/AdminJenisPraktikumIndexPage', [
            'pagination' => fn() => $jenisPraktikums,
        ]);
    }
    public function periodePraktikumIndexPage(Request $request)
    {
        $viewList = [ "10", "25", "50", "100" ];
        $viewPerPage = $request->query('view');

        if (!in_array($viewPerPage, $viewList)) {
            $viewPerPage = 10;
        } else {
            $viewPerPage = intval($viewPerPage);
        }

        $query = PeriodePraktikum::select('id', 'nama')->orderBy('created_at', 'desc');

        $search = $request->query('search');
        if ($search) {
            $query->where('nama', 'like', '%' . $search . '%');
        }

        $jenisPraktikums = $query->paginate($viewPerPage)->withQueryString();

        return Inertia::render('Admin/AdminPeriodePraktikumIndexPage', [
            'currentDate' => Carbon::now()->timezone('Asia/Jakarta')->toDateString(),
            'pagination' => fn() => $jenisPraktikums,
        ]);
    }
    public function praktikumIndexPage(Request $request)
    {
        $viewList = [ "10", "25", "50", "100" ];
        $viewPerPage = $request->query('view');

        if (!in_array($viewPerPage, $viewList)) {
            $viewPerPage = 10;
        } else {
            $viewPerPage = intval($viewPerPage);
        }

        $query = Praktikum::select('id', 'nama', 'tahun', 'status', 'periode_praktikum_id')
            ->with('periode:id,nama')
            ->orderBy('tahun', 'desc')
            ->orderBy('nama', 'desc');

        $search = $request->query('search');
        if ($search) {
            $query->where('nama', 'like', '%' . $search . '%');
        }

        $praktikums = $query->paginate($viewPerPage)->withQueryString();

        return Inertia::render('Admin/AdminPraktikumIndexPage', [
            'currentDate' => Carbon::now()->timezone('Asia/Jakarta')->toDateString(),
            'pagination' => fn() => $praktikums,
        ]);
    }
    public function praktikumCreatePage()
    {
        return Inertia::render('Admin/AdminPraktikumCreatePage', [
            'currentDate' => Carbon::now()->timezone('Asia/Jakarta')->toDateString(),
            'jenisPraktikums' => fn() => JenisPraktikum::select('id', 'nama')->orderBy('created_at', 'desc')->get(),
            'periodePraktikums' => fn() => PeriodePraktikum::select('id', 'nama')->get(),
        ]);
    }
    public function praktikumUpdatePage(Request $request)
    {
        $idParam = $request->query->get('q');
        if (!$idParam) {
            abort(404);
        }

        try {
            $praktikum = Praktikum::with([
                'jenis:id,nama',
                'periode:id,nama',
                'pertemuan:id,praktikum_id,nama',
                'pertemuan.modul:id,pertemuan_id,nama,topik',
                'sesi:id,nama,waktu'
            ])->findOrFail($idParam);

            return Inertia::render('Admin/AdminPraktikumUpdatePage', [
                'praktikum' => fn() => $praktikum->only([
                    'id',
                    'nama',
                    'tahun',
                    'status',
                    'jenis',
                    'periode',
                    'pertemuan',
                    'sesi'
                ]),
                'jenisPraktikums' => fn() => JenisPraktikum::select('id', 'nama')->orderBy('created_at', 'desc')->get(),
                'periodePraktikums' => fn() => PeriodePraktikum::select('id', 'nama')->get(),
            ]);
        } catch (QueryException $exception) {
            abort(500);
        }
    }
    public function praktikumPraktikanIndexPage(Request $request)
    {
        $idParam = $request->query->get('q');
        if (!$idParam) {
            abort(404);
        }

        try {
            $praktikum = Praktikum::with('praktikan:id,nama,npm')
                ->find($idParam);

            if (!$praktikum) {
                abort(404);
            }

            return Inertia::render('Admin/AdminPraktikumPraktikanIndexPage', [
                'praktikum' => fn() => $praktikum->only(['id', 'nama', 'praktikan'])
            ]);
        } catch (QueryException $exception) {
            abort(500);
        }
    }
    public function praktikumNilaiIndexPage(Request $request)
    {
        $idParam = $request->query->get('q');
        if (!$idParam) {
            abort(404);
        }

        try {
            $nilaiPraktikums = Praktikan::with(['nilai:id,nama,angka,pertemuan'])
                ->find($idParam);

            if (!$nilaiPraktikums) {
                abort(404);
            }

            return Inertia::render('Admin/AdminPraktikumPraktikanIndexPage', [
                'praktikum' => fn() => $nilaiPraktikums->only(['id', 'nama', 'praktikan'])
            ]);
        } catch (QueryException $exception) {
            abort(500);
        }
    }

    public function praktikanIndexPage(Request $request)
    {
        $viewList = [ "10", "25", "50", "100" ];
        $viewPerPage = $request->query('view');

        if (!in_array($viewPerPage, $viewList)) {
            $viewPerPage = 10;
        } else {
            $viewPerPage = intval($viewPerPage);
        }

        $query = Praktikan::select('id', 'nama', 'npm', 'username', 'avatar')->orderBy('created_at', 'desc');

        $search = $request->query('search');
        if ($search) {
            $query->where('nama', 'like', '%' . $search . '%');
        }

        $praktikans = $query->paginate($viewPerPage)->withQueryString();

        return Inertia::render('Admin/AdminPraktikanIndexPage', [
            'pagination' => fn() => $praktikans,
        ]);
    }
    public function praktikanCreatePage()
    {
        return Inertia::render('Admin/AdminPraktikanCreatePage');
    }
    public function praktikanCreateUploadPage()
    {
        return Inertia::render('Admin/AdminPraktikanCreateUploadPage');
    }
    public function praktikanUpdatePage(Request $request)
    {
        $idParam = $request->query->get('q');
        if (!$idParam) {
            abort(404);
        }

        try {
            $praktikan = Praktikan::findOrFail($idParam);

            return Inertia::render('Admin/AdminPraktikanUpdatePage', [
                'praktikan' => fn() => $praktikan->only(['id', 'nama', 'npm', 'username']),
            ]);
        } catch (QueryException $exception) {
            abort(500);
        }
    }


    public function aslabIndexPage(Request $request)
    {
        $viewList = [ "10", "25", "50", "100" ];
        $viewPerPage = $request->query('view');

        if (!in_array($viewPerPage, $viewList)) {
            $viewPerPage = 10;
        } else {
            $viewPerPage = intval($viewPerPage);
        }

        $query = Aslab::select('id', 'nama', 'npm', 'username', 'no_hp', 'jabatan', 'avatar')->orderBy('created_at', 'desc');

        $search = $request->query('search');
        if ($search) {
            $query->where('nama', 'like', '%' . $search . '%');
        }

        $aslabs = $query->paginate($viewPerPage)->withQueryString();

        return Inertia::render('Admin/AdminAslabIndexPage', [
            'pagination' => fn() => $aslabs,
        ]);
    }
    public function aslabCreatePage()
    {
        return Inertia::render('Admin/AdminAslabCreatePage');
    }
    public function aslabUpdatePage(Request $request)
    {
        $idParam = $request->query->get('q');
        if (!$idParam) {
            abort(404);
        }

        try {
            $aslab = Aslab::findOrFail($idParam);

            return Inertia::render('Admin/AdminAslabUpdatePage', [
                'aslab' => fn() => $aslab->only(['id', 'nama', 'npm', 'no_hp', 'username', 'aktif', 'jabatan', 'avatar']),
            ]);
        } catch (QueryException $exception) {
            abort(500);
        }
    }

    public function labelIndexPage(Request $request)
    {
        $viewList = [ "10", "25", "50", "100" ];
        $viewPerPage = $request->query('view');

        if (!in_array($viewPerPage, $viewList)) {
            $viewPerPage = 10;
        } else {
            $viewPerPage = intval($viewPerPage);
        }

        $query = Label::select('id', 'nama')->orderBy('created_at', 'desc');

        $search = $request->query('search');
        if ($search) {
            $query->where('nama', 'like', '%' . $search . '%');
        }

        $labelKuis = $query->paginate($viewPerPage)->withQueryString();

        return Inertia::render('Admin/AdminLabelIndexPage', [
            'pagination' => fn() => $labelKuis,
        ]);
    }
    public function soalIndexPage(Request $request)
    {
        $viewList = [ "10", "25", "50", "100" ];
        $viewPerPage = $request->query('view');

        if (!in_array($viewPerPage, $viewList)) {
            $viewPerPage = 10;
        } else {
            $viewPerPage = intval($viewPerPage);
        }

        $query = Soal::select('id', 'pertanyaan', 'pilihan_jawaban', 'kunci_jawaban')
            ->with('label:id,nama')
            ->orderBy('created_at', 'desc');

        $search = $request->query('search');
        if ($search) {
            $query->where('pertanyaan', 'like', '%' . $search . '%');
        }

        $soalKuis = $query->paginate($viewPerPage)->withQueryString();

        return Inertia::render('Admin/AdminSoalIndexPage', [
            'pagination' => fn() => $soalKuis,
        ]);
    }
    public function soalCreatePage()
    {
        return Inertia::render('Admin/AdminSoalCreatePage', [
            'labels' => fn() => Label::select('id', 'nama')->orderBy('created_at', 'desc')->get(),
        ]);
    }
    public function soalCreateUploadPage()
    {
        return Inertia::render('Admin/AdminSoalCreateUploadPage', [
            'labels' => fn() => Label::select('id', 'nama')->orderBy('created_at', 'desc')->get(),
        ]);
    }
    public function soalUpdatePage(Request $request)
    {
        $idParam = $request->query->get('q');
        if (!$idParam) {
            abort(404);
        }

        try {
            $soal = Soal::with(['label:id',])->findOrFail($idParam);
            $formattedSoal = [
                'id' => $soal->id,
                'pertanyaan' => $soal->pertanyaan,
                'pilihan_jawaban' => $soal->pilihan_jawaban,
                'kunci_jawaban' => $soal->kunci_jawaban,
                'label' => $soal->label->pluck('id')->toArray(),
            ];

            return Inertia::render('Admin/AdminSoalUpdatePage', [
                'soal' => fn() => $formattedSoal,
                'labels' => fn() => Label::select('id', 'nama')->orderBy('created_at', 'desc')->get(),
            ]);
        } catch (QueryException $exception) {
            abort(500);
        }
    }
    public function kuisIndexPage(Request $request)
    {
        $viewList = ["10", "25", "50", "100"];
        $viewPerPage = $request->query('view');

        if (!in_array($viewPerPage, $viewList)) {
            $viewPerPage = 10;
        } else {
            $viewPerPage = intval($viewPerPage);
        }

        $query = Kuis::select([
            'kuis.id as id',
            'kuis.nama as kuis_nama',
            'kuis.waktu_mulai',
            'kuis.waktu_selesai',
            'pertemuan.id as pertemuan_id',
            'pertemuan.nama as pertemuan_nama',
            'praktikum.id as praktikum_id',
            'praktikum.nama as praktikum_nama',
            DB::raw('(SELECT COUNT(*) FROM soal_kuis WHERE soal_kuis.kuis_id = kuis.id) as jumlah_soal')
        ])
            ->leftJoin('pertemuan', 'kuis.pertemuan_id', '=', 'pertemuan.id')
            ->leftJoin('praktikum', 'pertemuan.praktikum_id', '=', 'praktikum.id')
            ->orderBy('kuis.created_at', 'desc');

        $search = $request->query('search');
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('kuis.nama', 'like', '%' . $search . '%')
                    ->orWhere('pertemuan.nama', 'like', '%' . $search . '%')
                    ->orWhere('praktikum.nama', 'like', '%' . $search . '%');
            });
        }

        $kuis = $query->paginate($viewPerPage)->withQueryString();

        return Inertia::render('Admin/AdminKuisIndexPage', [
            'pagination' => $kuis
        ]);
    }
    public function kuisCreatePage()
    {
        return Inertia::render('Admin/AdminKuisCreatePage', [
            'currentDate' => Carbon::now('Asia/Jakarta')->toDateTimeString(),
            'labels' => fn() => Label::select('id', 'nama')->orderBy('created_at', 'desc')->get(),
            'praktikums' => fn() => Praktikum::select('id','nama')
                ->where('praktikum.status', true)
                ->with('pertemuan:id,nama,praktikum_id')
                ->get()
        ]);
    }
    public function kuisUpdatePage(Request $request)
    {
        $idParam = $request->query->get('q');
        if (!$idParam) {
            abort(404);
        }

        try {
            $kuis = Kuis::with('soal:id,pertanyaan')->findOrFail($idParam);

            return Inertia::render('Admin/AdminKuisUpdatePage', [
                'kuis' => fn() => [
                    'id' => $kuis->id,
                    'nama' => $kuis->nama,
                    'deskripsi' => $kuis->deskripsi,
                    'waktu_mulai' => $kuis->waktu_mulai,
                    'waktu_selesai' => $kuis->waktu_selesai,
                    'pertemuan_id' => $kuis->pertemuan_id,
                    'soal' => $kuis->soal->map(fn ($item) => [
                        'id' => $item->id,
                        'pertanyaan' => $item->pertanyaan,
                    ])
                ],
                'labels' => fn() => Label::select('id', 'nama')->orderBy('created_at', 'desc')->get(),
                'praktikums' => fn() => Praktikum::select('id','nama')
                    ->where('praktikum.status', true)
                    ->with('pertemuan:id,nama,praktikum_id')
                    ->get()
            ]);
        } catch (QueryException $exception) {
            abort(500);
        }
    }
    public function kuisViewPage(Request $request)
    {
        $idParam = $request->query->get('q');
        if (!$idParam) {
            abort(404);
        }

        try {
            $kuis = Kuis::findOrFail($idParam);

            return Inertia::render('Admin/AdminKuisViewPage', [
                'kuis' => fn() => $kuis->only(['id', 'deskripsi']),
            ]);
        } catch (QueryException $exception) {
            abort(500);
        }
    }

    public function nilaiIndexPage(Request $request)
    {
        $viewList = [ "10", "25", "50", "100" ];
        $viewPerPage = $request->query('view');

        if (!in_array($viewPerPage, $viewList)) {
            $viewPerPage = 10;
        } else {
            $viewPerPage = intval($viewPerPage);
        }

        $query = Praktikum::select('id', 'nama', 'tahun', 'status', 'periode_praktikum_id')
            ->with('periode:id,nama')
            ->where('praktikum.status', true)
            ->orderBy('tahun', 'desc')
            ->orderBy('nama', 'desc');

        $search = $request->query('search');
        if ($search) {
            $query->where('nama', 'like', '%' . $search . '%');
        }

        $praktikums = $query->paginate($viewPerPage)->withQueryString();

        return Inertia::render('Admin/AdminNilaiIndexPage', [
            'currentDate' => Carbon::now()->timezone('Asia/Jakarta')->toDateString(),
            'pagination' => fn() => $praktikums,
        ]);
    }
    public function nilaiDetailsPage(Request $request)
    {
        $nilaiPraktikans = Praktikan::with([
            'nilai:id,angka',
        ])
//            ->whereHas('praktikum', function ($q) use ($request) {
//                $q->where('id', $request->query->get('q'));
//            })
            ->get(['id', 'nama', 'npm']);

        return Inertia::render('Admin/AdminNilaiDetailsPage', [
            'nilaiPraktikans' => $nilaiPraktikans
        ]);
    }
}
