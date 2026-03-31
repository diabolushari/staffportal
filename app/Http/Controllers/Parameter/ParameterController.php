<?php

namespace App\Http\Controllers\Parameter;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class ParameterController extends Controller
{
    public function index(): InertiaResponse
    {
        return Inertia::render('Parameters/ParameterIndex');
    }
}
