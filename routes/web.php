<?php

use App\Http\Controllers\AdminPagesController;
use App\Http\Controllers\AslabController;
use App\Http\Controllers\JenisPraktikumController;
use App\Http\Controllers\LabelController;
use App\Http\Controllers\ModulController;
use App\Http\Controllers\PeriodePraktikumController;
use App\Http\Controllers\PertemuanController;
use App\Http\Controllers\PraktikanController;
use App\Http\Controllers\PraktikumController;
use App\Http\Controllers\SoalController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Response;
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
Route::get('/hall-of-fames', function () {
    return Inertia::render('HallOfFamesPage');
})->name('hall-of-fames');

Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminPagesController::class, 'dashboardAdminPage'])->name('dashboard');
    Route::prefix('aslab')->name('aslab.')->group(function () {
        Route::get('/', [AdminPagesController::class, 'aslabIndexPage'])->name('index');
        Route::get('/create', [AdminPagesController::class, 'aslabCreatePage'])->name('create');
        Route::get('/update', [AdminPagesController::class, 'aslabUpdatePage'])->name('update');
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
    Route::prefix('kuis')->name('kuis.')->group(function () {
        Route::prefix('label')->name('label.')->group(function () {
            Route::get('/', [AdminPagesController::class, 'labelIndexPage'])->name('index');
        });
        Route::prefix('soal')->name('soal.')->group(function () {
            Route::get('/', [AdminPagesController::class, 'soalIndexPage'])->name('index');
            Route::get('/create', [AdminPagesController::class, 'soalCreatePage'])->name('create');
            Route::get('/create-upload', [AdminPagesController::class, 'soalCreateUploadPage'])->name('create-upload');
        });
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
Route::prefix('aslab')->name('aslab.')->group(function () {
    Route::post('/create', [AslabController::class, 'store'])->name('create');
    Route::post('/update', [AslabController::class, 'update'])->name('update');
    Route::post('/delete', [AslabController::class, 'destroy'])->name('delete');
});
Route::prefix('praktikan')->name('praktikan.')->group(function () {
    Route::post('/create', [PraktikanController::class, 'store'])->name('create');
    Route::post('/update', [PraktikanController::class, 'update'])->name('update');
    Route::post('/delete', [PraktikanController::class, 'destroy'])->name('delete');
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


