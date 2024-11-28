<?php

namespace App\Http\Controllers;

use App\Models\Aslab;
use App\Models\Praktikan;
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
    public function aslabIndexPage(Request $request)
    {
        $viewList = [ "10", "25", "50", "100" ];
        $viewPerPage = $request->query('view');

        if (!in_array($viewPerPage, $viewList)) {
            $viewPerPage = 10;
        } else {
            $viewPerPage = intval($viewPerPage);
        }

        $query = Aslab::select('id', 'nama', 'npm', 'username', 'avatar', 'created_at')->orderBy('created_at', 'desc');

        $search = $request->query('search');
        if ($search) {
            $query->where('nama', 'like', '%' . $search . '%');
        }

        $aslabs = $query->paginate($viewPerPage)->withQueryString();

        return Inertia::render('Admin/AdminAslabIndexPage', [
            'pagination' => fn() => $aslabs,
        ]);
    }
    public function jenisPraktikumIndexPage()
    {
        return Inertia::render('Admin/AdminJenisPraktikumIndexPage');
    }
    public function periodePraktikumIndexPage()
    {
        return Inertia::render('Admin/AdminPeriodePraktikumIndexPage', [
            'currentDate' => Carbon::now()->timezone('Asia/Jakarta')->toDateString()
        ]);
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

        $query = Praktikan::select('id', 'nama', 'npm', 'username')->orderBy('created_at', 'desc');

        $search = $request->query('search');
        if ($search) {
            $query->where('nama', 'like', '%' . $search . '%');
        }

        $praktikans = $query->paginate($viewPerPage)->withQueryString();

        return Inertia::render('Admin/AdminPraktikanIndexPage', [
            'pagination' => fn() => $praktikans,
        ]);
    }
    public function praktikumIndexPage()
    {
        return Inertia::render('Admin/AdminPraktikumIndexPage');
    }
}
