<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $authUser = match (true) {
            Auth::guard('admin')->check() => Auth::guard('admin')->user(),
            default => null,
        };
        $role = match (true) {
            Auth::guard('admin')->check() => 'admin',
            default => null,
        };
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $authUser
                    ? [
                        'id' => $authUser->id,
                        'nama' => $authUser->nama,
                        'username' => $authUser->username,
                        'npm' => $authUser->npm ?? null,
                        'avatar' => $authUser->avatar ?? null,
                    ] : null,
                'role' => $role
            ],
        ];
    }
}
