<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Zadanie extends Model
{
    //
    protected $table = 'zadanie';
    protected $primaryKey = 'idZadanie';
    public $timestamps = false;

    protected $fillable = [
        'nazwa',
        'tresc',
        'TerminOddania',
        'CzyNaOcene',
        'kurs_idkurs'
    ];

    public function ocena(){
        return $this->hasOne(Ocena::class, 'Zadanie_idZadanie', 'idZadanie');
    }
    

    public function student(){
        return $this->belongsToMany(Student::class, 'student_has_zadanie',  'Student_idStudent','Zadanie_idZadanie',);
    }

    public function kurs(){
        return $this->belongsTo(Kurs::class, 'kurs_idkurs', 'idkurs');
    }

    public function plik(){
        return $this->hasMany(Plik::class, 'Zadanie_idZadanie', 'idZadanie');
    }

}
