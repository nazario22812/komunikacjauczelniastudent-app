<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Prowadzacy extends Model
{
    //
    protected $table = 'prowadzacy';
    protected $primaryKey = 'idProwadzacy';


    protected $fillable = [
        'TytulNaukowy',
        'katedra',
        'User_idUser',
        'Zajęcie_idZajęcie',
        'Zajęcie_PlanZajec_idPlanZajec',
        'Zajęcie_Sala_idSala',
        'Zajęcie_Sala_Budynek_idBudynek'
    ];

    public function user(){
        return $this->belongsTo(User::class, 'User_idUser', 'idUser');
    }


    public function przedmiot(){
        return $this->belongsToMany(Przedmiot::class, 'prowadzacy_has_przedmiot', 'Prowadzacy_idProwadzacy', 'Przedmiot_idPrzedmiot');
    }

   public function rezerwacja(){
        return $this->hasMany(Rezerwacja::class, 'Prowadzacy_idProwadzacy', 'idProwadzacy');
    }

    public function zajecie(){
        return $this->hasMany(Zajecie::class, 'Prowadzacy_idProwadzacy', 'idProwadzacy');
    }
}
