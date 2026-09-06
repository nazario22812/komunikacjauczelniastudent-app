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
        'tresc',
        'TerminOddania',
        'CzyNaOcene',
        'Zajęcie_idZajęcie',
    ];

    public function ocena(){
        return $this->hasOne(Ocena::class, 'Zadanie_idZadanie', 'idZadanie');
    }
    public function zajecie(){
        return $this->belongsTo(Zajecie::class, 'Zajęcie_idZajęcie', 'idZajęcie');
    }

    public function student(){
        return $this->belongsToMany(Student::class, 'student_has_zadanie',  'Student_idStudent','Zadanie_idZadanie',);
    }
}
