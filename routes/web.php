<?php

use App\Http\Controllers\AdminPagesController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminPagesController::class, 'dashboardAdminPage'])->name('dashboard');
    Route::prefix('aslab')->name('aslab.')->group(function () {
        Route::get('/', [AdminPagesController::class, 'aslabIndexPage'])->name('index');
    });
    Route::prefix('praktikan')->name('praktikan.')->group(function () {
        Route::get('/', [AdminPagesController::class, 'praktikanIndexPage'])->name('index');
    });
    Route::prefix('praktikum')->name('praktikum.')->group(function () {
        Route::get('/', [AdminPagesController::class, 'praktikumIndexPage'])->name('index');
    });
    Route::prefix('jenis-praktikum')->name('jenis-praktikum.')->group(function () {
        Route::get('/', [AdminPagesController::class, 'jenisPraktikumIndexPage'])->name('index');
    });
    Route::prefix('periode-praktikum')->name('periode-praktikum.')->group(function () {
        Route::get('/', [AdminPagesController::class, 'periodePraktikumIndexPage'])->name('index');
    });
});
Route::get('/login-admin', [AdminPagesController::class, 'loginAdminPage'])->name('login-admin');
Route::get('/praktikan', function () {
    return Inertia::render('AdminPraktikanIndexPage');
});
