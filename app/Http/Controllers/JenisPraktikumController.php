<?php

namespace App\Http\Controllers;

use App\Models\JenisPraktikum;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Str;

class JenisPraktikumController extends Controller
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
            'nama' => 'required|string|unique:jenis_praktikum,nama',
        ], [
            'nama.required' => 'Nama Jenis Praktikum harus diisi!',
            'nama.string' => 'Format Nama Jenis Praktikum tidak valid!',
            'nama.unique' => 'Nama Jenis Praktikum sudah terdaftar!',
        ]);

        try {
            JenisPraktikum::create([
                'id' => Str::uuid(),
                'nama' => $validated['nama']
            ]);
            return Response::json([
                'message' => 'Jenis Praktikum berhasil ditambahkan!'
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
            'id' => 'required|string|exists:jenis_praktikum,id',
            'nama' => 'required|string',
        ], [
            'id.required' => 'Format Jenis Praktikum tidak valid!',
            'id.string' => 'Format Jenis Praktikum tidak valid!',
            'id.exists' => 'Jenis Praktikum tidak ditemukan!',
            'nama.required' => 'Nama Jenis Praktikum harus diisi!',
            'nama.string' => 'Format Nama Jenis Praktikum tidak valid!',
        ]);

        try {
            $jenisPraktikum = JenisPraktikum::findOrFail($validated['id']);
            $jenisPraktikum->update([
                'nama' => $validated['nama']
            ]);
            return Response::json([
                'message' => 'Jenis Praktikum berhasil diperbarui!'
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
            'id' => 'required|string|exists:jenis_praktikum,id',
        ], [
            'id.required' => 'Format Jenis Praktikum tidak valid!',
            'id.string' => 'Format Jenis Praktikum tidak valid!',
            'id.exists' => 'Jenis Praktikum tidak ditemukan!',
        ]);

        try {
            $jenisPraktikum = JenisPraktikum::findOrFail($validated['id']);
            $jenisPraktikum->delete();
            return Response::json([
                'message' => 'Jenis Praktikum berhasil dihapus!'
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
