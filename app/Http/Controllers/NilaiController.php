<?php

namespace App\Http\Controllers;

use App\Models\Nilai;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Str;

class NilaiController extends Controller
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
            'praktikan_id' => 'required|uuid|exists:praktikan,id',
            'pertemuan_id' => 'required|uuid|exists:pertemuan,id',
            'jenis_nilai_id' => 'required|uuid|exists:jenis_nilai,id',
            'angka' => 'required|integer',
        ]);

        DB::beginTransaction();
        try {
            Nilai::create([
                'id' => Str::uuid(),
                'praktikan_id' => $validated['praktikan_id'],
                'pertemuan_id' => $validated['pertemuan_id'],
                'jenis_nilai_id' => $validated['jenis_nilai_id'],
                'angka' => $validated['angka'],
            ]);

            DB::commit();

            return Response::json([
                'message' => 'Data Nilai berhasil disimpan!',
            ], 201);
        } catch (QueryException $exception) {
            DB::rollBack();
            return Response::json([
                'message' => config('app.debug')
                    ? $exception->getMessage()
                    : 'Server gagal memproses permintaan',
            ], 500);
        }
    }

    public function storeMass(Request $request)
    {
        $validated = $request->validate([
            'nilai' => 'required|array',
            'nilai.*.praktikan_id' => 'required|uuid',
            'nilai.*.pertemuan_id' => 'required|uuid',
            'nilai.*.jenis_nilai_id' => 'required|uuid',
            'nilai.*.angka' => 'required|integer',
        ]);

        DB::beginTransaction();
        try {
            $nilaiData = [];
            $now = Carbon::now('Asia/Jakarta');

            foreach ($validated['nilai'] as $nilai) {
                $nilaiData[] = [
                    'id' => Str::uuid(),
                    'praktikan_id' => $nilai['praktikan_id'],
                    'pertemuan_id' => $nilai['pertemuan_id'],
                    'jenis_nilai_id' => $nilai['jenis_nilai_id'],
                    'angka' => $nilai['angka'],
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }

            Nilai::upsert(
                $nilaiData,
                ['praktikan_id', 'pertemuan_id', 'jenis_nilai_id'],
                ['angka', 'updated_at']
            );

            DB::commit();

            return Response::json([
                'message' => 'Data Nilai berhasil diproses!',
            ], 201);
        } catch (QueryException $exception) {
            DB::rollBack();
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
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
