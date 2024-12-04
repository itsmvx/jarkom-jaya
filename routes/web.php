<?php

use App\Http\Controllers\AdminPagesController;
use App\Http\Controllers\JenisPraktikumController;
use App\Http\Controllers\PeriodePraktikumController;
use App\Http\Controllers\PraktikanController;
use App\Http\Controllers\PraktikumController;
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
Route::get('/hall-of-fames', function () {
    return Inertia::render('HallOfFamesPage');
})->name('hall-of-fames');

Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminPagesController::class, 'dashboardAdminPage'])->name('dashboard');
    Route::prefix('aslab')->name('aslab.')->group(function () {
        Route::get('/', [AdminPagesController::class, 'aslabIndexPage'])->name('index');
    });
    Route::prefix('praktikan')->name('praktikan.')->group(function () {
        Route::get('/', [AdminPagesController::class, 'praktikanIndexPage'])->name('index');
        Route::get('/create', [AdminPagesController::class, 'praktikanCreatePage'])->name('create');
        Route::get('/update', [AdminPagesController::class, 'praktikanUpdatePage'])->name('update');
    });
    Route::prefix('praktikum')->name('praktikum.')->group(function () {
        Route::get('/', [AdminPagesController::class, 'praktikumIndexPage'])->name('index');
        Route::get('/create', [AdminPagesController::class, 'praktikumCreatePage'])->name('create');
        Route::get('/update', [AdminPagesController::class, 'praktikumUpdatePage'])->name('update');
    });
    Route::prefix('jenis-praktikum')->name('jenis-praktikum.')->group(function () {
        Route::get('/', [AdminPagesController::class, 'jenisPraktikumIndexPage'])->name('index');
    });
    Route::prefix('periode-praktikum')->name('periode-praktikum.')->group(function () {
        Route::get('/', [AdminPagesController::class, 'periodePraktikumIndexPage'])->name('index');
    });
});
Route::get('/login-admin', [AdminPagesController::class, 'loginAdminPage'])->name('admin.login');
Route::get('/praktikan', function () {
    return Inertia::render('AdminPraktikanIndexPage');
});

Route::prefix('jenis-praktikum')->name('jenis-praktikum.')->group(function () {
    Route::post('/create', [JenisPraktikumController::class, 'store'])->name('create');
    Route::post('/update', [JenisPraktikumController::class, 'update'])->name('update');
    Route::post('/delete', [JenisPraktikumController::class, 'destroy'])->name('delete');
});
Route::prefix('periode-praktikum')->name('periode-praktikum.')->group(function () {
    Route::post('/create', [PeriodePraktikumController::class, 'store'])->name('create');
    Route::post('/update', [PeriodePraktikumController::class, 'update'])->name('update');
    Route::post('/delete', [PeriodePraktikumController::class, 'destroy'])->name('delete');
});
Route::prefix('praktikum')->name('praktikum.')->group(function () {
    Route::post('/create', [PraktikumController::class, 'store'])->name('create');
    Route::post('/update', [PraktikumController::class, 'update'])->name('update');
    Route::post('/delete', [PraktikumController::class, 'destroy'])->name('delete');
    Route::post('/update-status', [PraktikumController::class, 'updateStatus'])->name('update-status');
});
Route::prefix('praktikan')->name('praktikan.')->group(function () {
    Route::post('/create', [PraktikanController::class, 'store'])->name('create');
    Route::post('/update', [PraktikanController::class, 'update'])->name('update');
    Route::post('/delete', [PraktikanController::class, 'destroy'])->name('delete');
});
