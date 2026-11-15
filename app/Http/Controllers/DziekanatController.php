<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DziekanatController extends Controller
{
    //

    public function podania(Request $request){
        
        return Inertia::render('PracownikDziekanatu/Podania');
    }
}
