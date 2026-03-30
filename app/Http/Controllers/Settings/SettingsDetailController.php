<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class SettingsDetailController extends Controller
{
    public function settingsDetail(): Response
    {
        return Inertia::render('Settings/SettingsDetail');
    }
}
