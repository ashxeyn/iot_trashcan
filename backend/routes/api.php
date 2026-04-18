<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BinController;

Route::get('/bin/status', [BinController::class, 'status']);
Route::post('/bin/open', [BinController::class, 'open']);
Route::post('/device/sync', [BinController::class, 'sync']);
Route::get('/logs/history', [BinController::class, 'history']);
