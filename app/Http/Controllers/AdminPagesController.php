<?php

namespace App\Http\Controllers;

use App\Models\Aslab;
use App\Models\JenisPraktikum;
use App\Models\Label;
use App\Models\PeriodePraktikum;
use App\Models\Praktikan;
use App\Models\Praktikum;
use App\Models\Soal;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class AdminPagesController extends Controller
{
    public function loginAdminPage()
    {
        return Inertia::render('Admin/AdminLoginPage');
    }
    public function dashboardAdminPage()
    {
        return Inertia::render('Admin/AdminDashboardPage');
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
                ]),
                'jenisPraktikums' => fn() => JenisPraktikum::select('id', 'nama')->orderBy('created_at', 'desc')->get(),
                'periodePraktikums' => fn() => PeriodePraktikum::select('id', 'nama')->get(),
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

        $query = Aslab::select('id', 'nama', 'npm', 'username', 'no_hp', 'avatar')->orderBy('created_at', 'desc');

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
                'aslab' => fn() => $aslab->only(['id', 'nama', 'npm', 'no_hp', 'username']),
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
            $query->where('nama', 'like', '%' . $search . '%');
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
}
