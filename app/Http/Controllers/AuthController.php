<?php

namespace App\Http\Controllers;

use App\Models\Praktikan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function authAdmin(Request $request): JsonResponse
    {
        $validation = Validator::make($request->only(['username', 'password']), [
            'username' => 'required|string',
            'password' => 'required|string'
        ], [
            'username.required' => 'Username tidak boleh kosong!',
            'password.required' => 'Password tidak boleh kosong!',
            'username.string' => 'Format username tidak valid!',
            'password.string' => 'Format password tidak valid!'
        ]);

        if ($validation->fails()) {
            return Response::json([
                'message' => $validation->errors()->first()
            ], 422);
        }

        if (Auth::guard('admin')->attempt($request->only('username', 'password'))) {
            $admin = Auth::guard('admin')->user();

            return Response::json([
                'message' => 'Login berhasil',
                'data' => [
                    'id' => $admin->id,
                    'nama' => $admin->nama,
                    'username' => $admin->username ?? null,
                    'npm' => $admin->npm ?? null,
                    'avatar' => $admin->avatar ?? null,
                ],
                'role' => 'admin'
            ]);
        } else {
            return Response::json([
                'message' => 'Username atau password salah'
            ], 401);
        }
    }

    /**
     * @throws ValidationException
     */

    public function authAslab(Request $request): JsonResponse
    {
        $validation = Validator::make($request->only(['npm', 'password']), [
            'npm' => 'required|string',
            'password' => 'required|string'
        ], [
            'npm.required' => 'NPM tidak boleh kosong!',
            'password.required' => 'Password tidak boleh kosong!',
            'npm.string' => 'Format NPM tidak valid!',
            'password.string' => 'Format password tidak valid!'
        ]);

        if ($validation->fails()) {
            return Response::json([
                'message' => $validation->errors()->first()
            ], 422);
        }

        $reqPassword = $request->get('password') ?? '';

        $pegawai = Aslab::where('username', $request->username)
            ->orWhere('nip', $request->username)
            ->first();

        if ($pegawai && Hash::check($reqPassword, $pegawai->password)) {
            Auth::guard('pegawai')->login($pegawai);

            $unit = $pegawai->unit;

            return Response::json([
                'message' => 'Login berhasil',
                'data' => [
                    'id' => $pegawai->id,
                    'nama' => $pegawai->nama,
                    'username' => $pegawai->username,
                    'unit' => $unit ? [
                        'id' => $unit->id,
                        'nama' => $unit->nama,
                    ] : null,
                    'role' => 'pegawai'
                ]
            ], 200);
        } else {
            return Response::json([
                'message' => 'Username/NIP atau password salah'
            ], 401);
        }
    }

    public function authPraktikan(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'username' => 'required|string|min:3',
            'password' => 'required|string|min:6'
        ]);

        $praktikan = Praktikan::where('npm', $validated['username'])
            ->orWhere('username', $validated['username'])
            ->first();

        if ($praktikan && Hash::check($validated['password'], $praktikan->password)) {
            Auth::guard('praktikan')->login($praktikan);

            return Response::json([
                'message' => 'Login berhasil',
            ], 200);
        } else {
            return Response::json([
                'message' => 'Username/NPM atau password salah'
            ], 401);
        }
    }
    public function logout(Request $request): JsonResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Response::json([
            'message' => 'Logout berhasil!',
        ]);
    }
}
