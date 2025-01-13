<?php

namespace App\Http\Controllers;

use App\Models\Praktikum;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Response;

class PraktikumPraktikanController extends Controller
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
            'praktikan_ids' => 'required|array',
            'praktikan_ids.*' => 'uuid',
            'praktikum_id' => 'required|uuid|exists:praktikum,id',
        ]);

        DB::beginTransaction();
        try {
            $praktikum = Praktikum::findOrFail($validated['praktikum_id']);
            $praktikum->praktikan()->sync($validated['praktikan_ids']);

            DB::commit();
            return Response::json([
                'message' => 'Praktikan berhasil didaftarkan ke Praktikum!',
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return Response::json([
                'message' => 'Validasi gagal.',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            return Response::json([
                'message' => config('app.debug')
                    ? $e->getMessage()
                    : 'Server gagal memproses permintaan.',
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
    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'praktikum_id' => 'required|uuid|exists:praktikum,id',
            'praktikan_id' => 'required|uuid|exists:praktikan,id',
        ]);

        DB::beginTransaction();
        try {
            $praktikum = Praktikum::findOrFail($validated['praktikum_id']);
            $isDetached = $praktikum->praktikan()->detach($validated['praktikan_id']);

            DB::commit();

            if ($isDetached) {
                return Response::json([
                    'message' => 'Praktikan berhasil dihapus dari Praktikum!',
                ], 200);
            } else {
                return Response::json([
                    'message' => 'Praktikan tidak terdaftar pada Praktikum ini.',
                ], 404);
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return Response::json([
                'message' => 'Validasi gagal.',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            return Response::json([
                'message' => config('app.debug')
                    ? $e->getMessage()
                    : 'Server gagal memproses permintaan.',
            ], 500);
        }
    }
}
