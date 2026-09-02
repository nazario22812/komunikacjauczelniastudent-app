<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Wydzial extends Model
{
    protected $table = 'wydzial';
    protected $primaryKey = 'idWydzial';

    protected $fillable = [
        'nazwa',
        
    ];

    public function budynek(){
        return $this->hasMany(Budynek::class, 'Wydzial_idWydzial', 'idWydzial');
    }

    public function kierunek(){
        return $this->hasMany(Kierunek::class, 'Wydzial_idWydzial', 'idWydzial');
    }
//
}
