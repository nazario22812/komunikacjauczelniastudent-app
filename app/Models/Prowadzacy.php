<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Prowadzacy extends Model
{
    //
    protected $table = 'prowadzacy';
    protected $primaryKey = 'idProwadzacy';
    public $timestamps = false;


    protected $fillable = [
        'TytulNaukowy',
        'katedra',
        'User_idUser',
        'Zajęcie_idZajęcie',
        
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
    public function kurs(){
        return $this->hasMany(Kurs::class, 'Prowadzacy_idProwadzacy', 'idProwadzacy');
    }
}
