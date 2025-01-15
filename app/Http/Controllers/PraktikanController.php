<?php

namespace App\Http\Controllers;

use App\Models\BanList;
use App\Models\Praktikan;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Storage;
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
    public function storeMass(Request $request)
    {
        $validated = $request->validate([
            'praktikans' => 'required|array',
            'praktikans.*.nama' => 'required|string',
            'praktikans.*.npm' => 'required|string',
        ]);

        DB::beginTransaction();
        try {
            $now = Carbon::now('Asia/Jakarta');
            $praktikansData = array_map(function ($praktikan) use ($now) {
                return [
                    'id' => Str::uuid(),
                    'nama' => $praktikan['nama'],
                    'npm' => $praktikan['npm'],
                    'password' => Hash::make($praktikan['npm'], ['rounds' => 12]),
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }, $validated['praktikans']);

            Praktikan::upsert(
                $praktikansData,
                ['npm'],
                ['nama', 'password', 'updated_at']
            );

            DB::commit();

            return Response::json([
                'message' => 'Semua Praktikan berhasil diproses!',
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

    public function checkNpmGET(Request $request)
    {
        $validated = $request->validate([
            'npm' => 'required|string',
        ]);

        try {
            $isNPMExists = Praktikan::where('npm', $validated['npm'])->exists();

            return Response::json([
                'message' => $isNPMExists ? 'NPM sudah terdaftar!' : 'NPM bisa digunakan!',
            ], $isNPMExists ? 409 : 200);
        } catch (QueryException $exception) {
            return Response::json([
                'message' => config('app.debug')
                    ? $exception->getMessage()
                    : 'Server gagal memproses permintaan',
            ]);
        }
    }
    public function checkNpmPOST(Request $request)
    {
        $validated = $request->validate([
            'npm' => 'required|array',
            'npm.*' => 'required|string',
        ]);

        try {
            $npmExists = Praktikan::select('npm')
                ->whereIn('npm', $validated['npm'])
                ->get()
                ->pluck('npm')
                ->toArray();

            return Response::json([
                'message' => empty($npmExists) ? 'Semua NPM dapat digunakan' : 'Ada sebagian data dengan NPM yang sudah terdaftar, cek errors untuk informasi lengkapnya',
                'errors' => $npmExists,
            ], empty($npmExists) ? 200 : 409);
        } catch (QueryException $exception) {
            return Response::json([
                'message' => config('app.debug')
                    ? $exception->getMessage()
                    : 'Server gagal memproses permintaan',
            ]);
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

    public function getPraktikans(Request $request)
    {
        $request->validate([
            'search' => 'nullable|string|min:1',
            'npm' => 'required|array',
            'npm.*' => 'required|string',
            'columns' => 'nullable|array',
            'columns.*' => 'string|in:id,nama,npm,username,avatar',
        ]);

        $columnsParam = $request->get('columns');
        $searchParam = $request->get('search');
        $npmParam = $request->get('npm');

        try {
            $query = Praktikan::select($columnsParam ?? ['id','nama','npm']);

            if ($searchParam) {
                $query->where('nama', 'like', '%' . $searchParam . '%');
                $query->orWhere('npm', 'like', '%' . $searchParam . '%');
            }

            if ($npmParam) {
                $query->whereIn('npm', $npmParam);
            }

            $praktikans = $query->get();

            return Response::json([
                'message' => empty($praktikans)
                    ? 'Server berhasil memproses permintaan, namun tidak ada data yang sesuai dengan pencarian diminta'
                    : 'Berhasil mengambil data!',
                'data' => $praktikans,
            ]);
        } catch (QueryException $exception) {
            return Response::json([
                'message' => config('app.debug')
                    ? $exception->getMessage()
                    : 'Server gagal memproses permintaan',
            ]);
        }
    }

    public function uploadAvatar(Request $request)
    {
        $validated = $request->validate([
            'avatar' => 'required|file|mimes:jpg,jpeg,png|max:10240',
            'id' => 'required|exists:praktikan,id',
        ]);

        DB::beginTransaction();

        try {
            $praktikan = Praktikan::findOrFail($validated['id']);

            if ($praktikan->avatar) {
                Storage::disk('praktikan')->delete($praktikan->avatar);
            }

            $extension = $request->file('avatar')->getClientOriginalExtension();
            $randomString = Str::random(8);
            $filename = $praktikan->nama . '-' . $praktikan->npm . '-' . $randomString . '.' . $extension;

            $avatarPath = $request->file('avatar')->storeAs('/', $filename, 'praktikan');
            $praktikan->update(['avatar' => $avatarPath]);

            DB::commit();

            return response()->json([
                'message' => 'Avatar berhasil diunggah!',
                'avatar_url' => $avatarPath,
            ], 200);
        } catch (\Exception $exception) {
            DB::rollBack();

            if (isset($avatarPath)) {
                Storage::disk('praktikan')->delete($avatarPath);
            }

            return response()->json([
                'message' => config('app.debug') ? $exception->getMessage() : 'Gagal mengunggah avatar..',
            ], 500);
        }
    }
    public function addBanList(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|exists:praktikan,id',
            'alasan' => 'nullable|string|min:1',
        ]);

        $authPraktikan = Auth::guard('praktikan')->user();
        if (!$authPraktikan || ($authPraktikan->id !== $validated['id'])) {
            return Response::json([
                'message' => 'Hey.. ngapain kamu?'
            ], 403);
        }

        try {
            BanList::create([
                'praktikan_id' => $validated['id'],
                'alasan' => $validated['alasan'] ?? 'Tidak diketahui',
                'kadaluarsa' => Carbon::now('Asia/Jakarta')->addWeeks(2),
            ]);
            return Response::json([
                'message' => 'Berhasil memproses ban list'
            ]);
        } catch (QueryException $exception) {
            return Response::json([
                'message' => config('app.debug')
                    ? $exception->getMessage()
                    : 'Server gagal memproses permintaan',
            ]);
        }
    }
}
