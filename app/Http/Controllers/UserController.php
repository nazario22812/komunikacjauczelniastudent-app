<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    //
    public function main(Request $request){
        $user = $request->user();
        $role = '';

        $polaroli = [];

        if($user->isStudent()){
            $role = 'Student';
            $polaroli = [
                'index' => $user->student->index,
                'semester' => $user->student->semester,
                'stopien' => $user->student->stopien,
                'trybStudiow' => $user->student->trybStudiow,
                'rok' => $user->student->rok,
                'Specjalnosc' => $user->student->Specjalnosc ?? null,
                'kierunek' => $user->student->kierunek->nazwa,
                'wydzial' => $user->student->kierunek->wydzial->nazwa,
            ];
        }
        if($user->isProwadzacy()){
            $role = 'Prowadzący';
            $polaroli = [
                'TytulNaukowy' => $user->prowadzacy->TytulNaukowy,
                'katedra' => $user->prowadzacy->katedra,
            ];
        }
        if($user->isPracownikDziekanatu()){
            $role = 'Pracownik Dziekanatu';
            $polaroli = [
                'Odpowiedzialnosc' => $user->pracownikdziekanatu->Odpowiedzialnosc ?? null,
            ];
        }
        //czesc dla wyciagniecia zdjecia z bazy
        $base64data = $user->photo; 
        $photourl = $base64data ? 'data:image/jpeg;base64,' . $base64data : null;
        
        return Inertia::render('MojeDane', array_merge([
            'rol' => $role,
            'name' => $user->name,
            'surname' => $user->surname,
            'email' => $user->email,
            'numerTelefonu' => $user->numerTelefonu,
            'kontoBankowe' => $user->kontoBankowe,
            'DataUrodzenia' => $user->DataUrodzenia,
            'photo' => $photourl
        ], $polaroli));
    }

}
