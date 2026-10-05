<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kurs extends Model
{
    //
    protected $table = 'kurs';
    protected $primaryKey = 'idkurs';
    public $timestamps = false;


    protected $fillable = [
        'nazwa',
        'kod',
        'Przedmiot_idPrzedmiot',
        'Prowadzacy_idProwadzacy',
    ];

    public function student(){
        return $this->belongsToMany(Student::class, 'kurs_has_student', 'Kurs_idkurs', 'Student_idStudent');
    }

    public function przedmiot(){
        return $this->belongsTo(Przedmiot::class, 'Przedmiot_idPrzedmiot', 'idPrzedmiot');
    }

    public function prowadzacy(){
        return $this->belongsTo(Prowadzacy::class, 'Prowadzacy_idProwadzacy', 'idProwadzacy');
    }

    public function ocena(){
        return $this->hasMany(Ocena::class, 'kurs_idkurs', 'idkurs');
    } 

    public function plik(){
        return $this->hasMany(Plik::class,  'Kurs_idkurs', 'idkurs');
    }

    public function zadanie(){
        return $this->hasMany(Zadanie::class, 'kurs_idkurs', 'idkurs');
    }
}
