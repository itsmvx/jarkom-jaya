<?php

namespace App\Http\Controllers;

use App\Models\Aslab;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Str;

class AslabController extends Controller
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
            'nama' => 'required|string|min:1',
            'npm' => 'required|string|min:1|unique:aslab,npm',
            'no_hp' => 'nullable|string|min:1',
            'username' => 'required|string|min:1|unique:aslab,username',
            'password' => 'required|string|min:1',
            'aktif' => 'required|boolean',
            'jabatan' => 'required|string|min:1',
        ]);

        try {
            Aslab::create([
                'id' => Str::uuid(),
                'nama' => $validated['nama'],
                'npm' => $validated['npm'],
                'no_hp' => $validated['no_hp'] ?? null,
                'username' => $validated['username'],
                'password' => Hash::make($validated['password'], ['rounds' => 12]),
                'aktif' => $validated['aktif'],
                'jabatan' => $validated['jabatan'],
            ]);

            return Response::json([
                'message' => 'Aslab berhasil ditambahkan!',
            ]);
        } catch (QueryException $exception) {
            return Response::json([
                'message' => config('app.debug')
                    ? $exception->getMessage()
                    : 'Server gagal memproses permintaan',
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
            'id' => 'required|exists:aslab,id',
            'nama' => 'required|string|min:1',
            'npm' => 'required|string|min:1|unique:aslab,npm,' . $request->id,
            'no_hp' => 'nullable|string|min:1',
            'username' => 'required|string|min:1|unique:aslab,username,' . $request->id,
            'aktif' => 'required|boolean',
            'jabatan' => 'required|string|min:1',
        ]);

        try {
            Aslab::where('id', $validated['id'])->update([
                'nama' => $validated['nama'],
                'npm' => $validated['npm'],
                'no_hp' => $validated['no_hp'],
                'username' => $validated['username'],
                'aktif' => $validated['aktif'],
                'jabatan' => $validated['jabatan'],
            ]);

            return Response::json([
                'message' => 'Aslab berhasil diperbarui!',
            ]);
        } catch (QueryException $exception) {
            return Response::json([
                'message' => config('app.debug')
                    ? $exception->getMessage()
                    : 'Server gagal memproses permintaan',
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|exists:aslab,id',
        ]);

        try {
            Aslab::where('id', $validated['id'])->delete();
            return Response::json([
                'message' => 'Aslab berhasil dihapus!',
            ]);
        } catch (QueryException $exception) {
            return Response::json([
                'message' => config('app.debug')
                    ? $exception->getMessage()
                    : 'Server gagal memproses permintaan',
            ], 500);
        }
    }
}
