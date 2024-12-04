<?php

namespace App\Http\Controllers;

use App\Models\PeriodePraktikum;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Str;

class PeriodePraktikumController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|unique:periode_praktikum,nama',
        ], [
            'nama.required' => 'Nama Periode Praktikum harus diisi!',
            'nama.string' => 'Format Nama Periode Praktikum tidak valid!',
            'nama.unique' => 'Periode Praktikum sudah terdaftar!',
        ]);

        try {
            PeriodePraktikum::create([
                'id' => Str::uuid(),
                'nama' => $validated['nama']
            ]);
            return Response::json([
                'message' => 'Periode Praktikum berhasil ditambahkan!'
            ]);
        } catch (QueryException $exception) {
            return Response::json([
                'message' => config('app.debug')
                    ? $exception->getMessage()
                    : 'Server gagal memproses permintaan'
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|string|exists:periode_praktikum,id',
            'nama' => 'required|string',
        ], [
            'id.required' => 'Format Periode Praktikum tidak valid!',
            'id.string' => 'Format Periode Praktikum tidak valid!',
            'id.exists' => 'Periode Praktikum tidak ditemukan!',
            'nama.required' => 'Nama Periode Praktikum harus diisi!',
            'nama.string' => 'Format Nama Periode Praktikum tidak valid!',
        ]);

        try {
            $periodePraktikum = PeriodePraktikum::findOrFail($validated['id']);
            $periodePraktikum->update([
                'nama' => $validated['nama']
            ]);
            return Response::json([
                'message' => 'Periode Praktikum berhasil diperbarui!'
            ]);
        } catch (QueryException $exception) {
            return Response::json([
                'message' => config('app.debug')
                    ? $exception->getMessage()
                    : 'Server gagal memproses permintaan'
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|string|exists:periode_praktikum,id',
        ], [
            'id.required' => 'Format Periode Praktikum tidak valid!',
            'id.string' => 'Format Periode Praktikum tidak valid!',
            'id.exists' => 'Periode Praktikum tidak ditemukan!',
        ]);

        try {
            $periodePraktikum = PeriodePraktikum::findOrFail($validated['id']);
            $periodePraktikum->delete();
            return Response::json([
                'message' => 'Periode Praktikum berhasil dihapus!'
            ]);
        } catch (QueryException $exception) {
            return Response::json([
                'message' => config('app.debug')
                    ? $exception->getMessage()
                    : 'Server gagal memproses permintaan'
            ], 500);
        }
    }
}
