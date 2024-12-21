<?php

namespace App\Http\Controllers;

use App\Models\LabelSoal;
use App\Models\Soal;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Str;

class SoalController extends Controller
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
            'label' => 'required|array',
            'label.*' => 'required|string|uuid|exists:label,id',
            'pertanyaan' => 'required|string',
            'pilihan_jawaban' => 'required|string',
            'kunci_jawaban' => 'required|string',
        ]);
        DB::beginTransaction();

        try {
            $soal = Soal::create([
                'id' => Str::uuid(),
                'pertanyaan' => $validated['pertanyaan'],
                'pilihan_jawaban' => $validated['pilihan_jawaban'],
                'kunci_jawaban' => $validated['kunci_jawaban'],
            ]);

            $soal->label()->sync($validated['label']);

            DB::commit();

            return Response::json([
                'message' => 'Soal berhasil ditambahkan!'
            ]);
        } catch (QueryException $e) {
            DB::rollBack();
            $message = config('app.debug') ? $e->getMessage() : 'Server gagal memproses permintaan';
            return Response::json([
                'message' => $message
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Soal $soalKuis)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Soal $soalKuis)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|exists:soal,id',
            'label' => 'required|string',
            'kode' => 'nullable|string',
            'pertanyaan' => 'required|string',
            'pilihan_jawaban' => 'required|string',
            'kunci_jawaban' => 'required|string',
        ]);

        try {
            Soal::where('id', $validated['id'])->update([
                'label' => $validated['label'],
                'kode' => $validated['kode'],
                'pertanyaan' => $validated['pertanyaan'],
                'pilihan_jawaban' => $validated['pilihan_jawaban'],
                'kunci_jawaban' => $validated['kunci_jawaban'],
            ]);
            return Response::json([
                'message' => 'Soal berhasil diperbarui!'
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
            'id' => 'required|string|exists:soal,id',
        ]);

        try {
            Soal::where('id', $validated['id'])->delete();
            return Response::json([
                'message' => 'Soal berhasil dihapus!'
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
