<?php

use App\Http\Controllers\AslabController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\JenisPraktikumController;
use App\Http\Controllers\KuisController;
use App\Http\Controllers\LabelController;
use App\Http\Controllers\ModulController;
use App\Http\Controllers\Pages\AdminPagesController;
use App\Http\Controllers\Pages\PraktikanPagesController;
use App\Http\Controllers\PeriodePraktikumController;
use App\Http\Controllers\PertemuanController;
use App\Http\Controllers\PraktikanController;
use App\Http\Controllers\PraktikumController;
use App\Http\Controllers\PraktikumPraktikanController;
use App\Http\Controllers\SesiPraktikumController;
use App\Http\Controllers\SoalController;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/assets/{filename}', function ($filename) {
    $allowedExtensions = ['xlsx', 'xls'];
    $extension = pathinfo($filename, PATHINFO_EXTENSION);

    if (!in_array($extension, $allowedExtensions)) {
        abort(403, 'Mangsut amat');
    }

    $path = public_path('assets/' . $filename);

    if (!file_exists($path)) {
        abort(404, 'File tidak ditemukan');
    }

    return Response::download($path);
})->name('assets');

Route::get('/test', function () {
    return Inertia::render('Test');
});

Route::get('/', function () {return Inertia::render('Welcome');});
Route::get('/hall-of-fames', function () {return Inertia::render('HallOfFamesPage');})->name('hall-of-fames');
Route::get('/ban-list', [PraktikanPagesController::class, 'banListPage'])->name('ban-list');

Route::get('/login-admin', [AdminPagesController::class, 'loginPage'])->name('admin.login');
Route::get('/login', [PraktikanPagesController::class, 'loginPage'])->name('praktikan.login');
Route::get('/register', [PraktikanPagesController::class, 'registerPage'])->name('praktikan.register');

Route::prefix('auth')->name('auth.')->group(function () {
    Route::post('/admin');
    Route::post('/praktikan', [AuthController::class, 'authPraktikan'])->name('praktikan');
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
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
Route::prefix('pertemuan')->name('pertemuan.')->group(function () {
    Route::post('/create', [PertemuanController::class, 'store'])->name('create');
    Route::post('/update', [PertemuanController::class, 'update'])->name('update');
    Route::post('/delete', [PertemuanController::class, 'destroy'])->name('delete');
});
Route::prefix('modul')->name('modul.')->group(function () {
    Route::post('/create', [ModulController::class, 'store'])->name('create');
    Route::post('/update', [ModulController::class, 'update'])->name('update');
    Route::post('/delete', [ModulController::class, 'destroy'])->name('delete');
});
Route::prefix('sesi-praktikum')->name('sesi-praktikum.')->group(function () {
    Route::post('/create', [SesiPraktikumController::class, 'store'])->name('create');
    Route::post('/update', [SesiPraktikumController::class, 'update'])->name('update');
    Route::post('/delete', [SesiPraktikumController::class, 'destroy'])->name('delete');
});
Route::prefix('aslab')->name('aslab.')->group(function () {
    Route::post('/create', [AslabController::class, 'store'])->name('create');
    Route::post('/update', [AslabController::class, 'update'])->name('update');
    Route::post('/delete', [AslabController::class, 'destroy'])->name('delete');
});
Route::prefix('praktikan')->name('praktikan.')->group(function () {
    Route::post('/create', [PraktikanController::class, 'store'])->name('create');
    Route::post('/create-mass', [PraktikanController::class, 'storeMass'])->name('create-mass');
    Route::post('/update', [PraktikanController::class, 'update'])->name('update');
    Route::post('/delete', [PraktikanController::class, 'destroy'])->name('delete');
    Route::post('/create-upload', [PraktikanController::class, 'uploadAvatar'])->name('upload-avatar');
    Route::post('/add-ban-list', [PraktikanController::class, 'addBanList'])->name('add-ban-list');
});
Route::prefix('praktikum-praktikan')->name('praktikum-praktikan.')->group(function () {
    Route::post('/create', [PraktikumPraktikanController::class, 'store'])->name('create');
    Route::post('/create-mass', [PraktikumPraktikanController::class, 'storeMass'])->name('create-mass');
    Route::post('/update', [PraktikumPraktikanController::class, 'update'])->name('update');
    Route::post('/delete', [PraktikumPraktikanController::class, 'destroy'])->name('delete');
});
Route::prefix('label')->name('label.')->group(function () {
    Route::post('/create', [LabelController::class, 'store'])->name('create');
    Route::post('/update', [LabelController::class, 'update'])->name('update');
    Route::post('/delete', [LabelController::class, 'destroy'])->name('delete');
});
Route::prefix('soal')->name('soal.')->group(function () {
    Route::post('/create', [SoalController::class, 'store'])->name('create');
    Route::post('/create-mass', [SoalController::class, 'storeMass'])->name('create-mass');
    Route::post('/update', [SoalController::class, 'update'])->name('update');
    Route::post('/delete', [SoalController::class, 'destroy'])->name('delete');
});
Route::prefix('kuis')->name('kuis.')->group(function () {
    Route::post('/create', [KuisController::class, 'store'])->name('create');
    Route::post('/update', [KuisController::class, 'update'])->name('update');
    Route::post('/delete', [KuisController::class, 'destroy'])->name('delete');
});

Route::get('/kuis', function () {
    return Inertia::render('KuisTest', [
        'soals' => \App\Models\Soal::select('id','pertanyaan','pilihan_jawaban')->limit(50)->get(),
    ]);
});


require __DIR__ . '/admin.php';
require __DIR__ . '/praktikan.php';
