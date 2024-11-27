<?php

namespace App\Http\Controllers;

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
    public function aslabIndexPage()
    {
        return Inertia::render('Admin/AdminAslabIndexPage');
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
    public function praktikanIndexPage()
    {
        return Inertia::render('Admin/AdminPraktikanIndexPage');
    }
    public function praktikumIndexPage()
    {
        return Inertia::render('Admin/AdminPraktikumIndexPage');
    }
}
