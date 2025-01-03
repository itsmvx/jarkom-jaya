<?php

namespace App\Http\Controllers;

use App\Models\Praktikan;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Str;

class PraktikanController extends Controller
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
            'npm' => 'required|string|min:1',
            'username' => 'required|string|min:1|unique:praktikan,username',
            'password' => 'required|string|min:1',
        ]);

        try {
            Praktikan::create([
                'id' => Str::uuid(),
                'nama' => $validated['nama'],
                'npm' => $validated['npm'],
                'username' => $validated['username'],
                'password' => Hash::make($validated['password'], ['rounds' => 12]),
            ]);

            return Response::json([
                'message' => 'Praktikan berhasil ditambahkan!',
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
            'id' => 'required|exists:praktikan,id',
            'nama' => 'required|string|min:1',
            'npm' => 'required|string|min:1',
            'username' => 'required|string|min:1|unique:praktikan,username,' . $request->id,
        ]);

        try {
            Praktikan::where('id', $validated['id'])->update([
                'nama' => $validated['nama'],
                'npm' => $validated['npm'],
                'username' => $validated['username'],
            ]);

            return Response::json([
                'message' => 'Praktikan berhasil diperbarui!',
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
            'id' => 'required|exists:praktikan,id',
        ]);

        try {
            Praktikan::where('id', $validated['id'])->delete();
            return Response::json([
                'message' => 'Praktikan berhasil dihapus!',
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
