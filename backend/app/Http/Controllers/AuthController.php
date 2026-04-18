<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required',
            'password' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // For this simple basic IoT site, return a dummy token flag
        // or a real API token if Sanctum is installed. We'll use a simple success status.
        return response()->json([
            'success' => true,
            'user' => $user,
            'token' => 'admin-auth-token-123'
        ]);
    }
}
