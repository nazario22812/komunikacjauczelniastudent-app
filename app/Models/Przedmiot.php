<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Przedmiot extends Model
{
    //
    protected $table = 'przedmiot';
    protected $primaryKey = 'idPrzedmiot';

    protected $fillable = [
        'nazwa',
        'punktyECTS',
        'typ'
    ];

    public function prowadzacy(){
        return $this->belongsToMany(Prowadzacy::class, 'prowadzacy_has_przedmiot',  'Prowadzacy_idProwadzacy','Przedmiot_idPrzedmiot');
    }

    public function sylabus(){
        return $this->hasOne(Sylabus::class, 'Przedmiot_idPrzedmiot', 'idPrzedmiot');
    }

    public function zajecie(){
        return $this->hasMany(Zajecie::class, 'Przedmiot_idPrzedmiot', 'idPrzedmiot');
    }

    public function ocena(){
        return $this->hasMany(Ocena::class, 'idPrzedmiot', 'idPrzedmiot');
    }
}
