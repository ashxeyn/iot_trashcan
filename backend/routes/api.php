<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BinController;
use App\Http\Controllers\AuthController;

Route::post('/login', [AuthController::class, 'login']);

Route::get('/bin/status', [BinController::class, 'status']);
Route::post('/bin/open', [BinController::class, 'open']);
Route::post('/device/sync', [BinController::class, 'sync']);
Route::get('/logs/history', [BinController::class, 'history']);
