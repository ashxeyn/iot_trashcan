<?php

namespace App\Http\Controllers;

use App\Models\Bin;
use App\Models\HistoryLog;
use Illuminate\Http\Request;

class BinController extends Controller
{
    public function status()
    {
        $bin = Bin::firstOrCreate(
            ['id' => 1],
            ['fill_level' => 0, 'manual_open_command' => false, 'is_online' => false]
        );

        return response()->json($bin);
    }

    public function open()
    {
        $bin = Bin::firstOrCreate(['id' => 1]);
        $bin->manual_open_command = true;
        $bin->save();

        HistoryLog::create([
            'event_type' => 'Manual Open',
            'level' => $bin->fill_level
        ]);

        return response()->json(['success' => true, 'message' => 'Lid opening command sent']);
    }

    public function sync(Request $request)
    {
        $request->validate([
            'fill_level' => 'required|integer|min:0|max:100',
        ]);

        $bin = Bin::firstOrCreate(['id' => 1]);
        $bin->fill_level = $request->input('fill_level');
        $bin->is_online = true;

        if ($bin->fill_level >= 81 && $bin->getOriginal('fill_level') < 81) {
             HistoryLog::create([
                'event_type' => 'Full',
                'level' => $bin->fill_level
            ]);
        }

        // The ESP32 logic: read manual_open_command to determine if it should force open.
        // Once true is sent to ESP32, it will open, and we reset the command flag here.
        $command = $bin->manual_open_command;
        if ($command) {
            $bin->manual_open_command = false;
        }

        $bin->save();

        return response()->json([
            'manual_open' => (bool)$command,
            'status' => 'synced'
        ]);
    }

    public function history()
    {
        $logs = HistoryLog::orderBy('created_at', 'desc')->take(50)->get();
        return response()->json($logs);
    }
}
