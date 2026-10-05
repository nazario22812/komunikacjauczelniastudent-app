<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ocena extends Model
{
    //
    protected $table = 'ocena';
    protected $primaryKey = 'idOcena';
    public $timestamps = false;

    protected $fillable = [
        'Semester',
        'skalaOceny',
        'TypZajec',
        'czyKoncowa',
        'idStudent',
        'idPrzedmiot',
        'Zadanie_idZadanie',
        'kurs_idkurs'
    ];


    public function student(){
        return $this->belongsTo(Student::class, 'idStudent', 'idStudent');
    }

    public function przedmiot(){
        return $this->belongsTo(Przedmiot::class, 'idPrzedmiot', 'idPrzedmiot');
    }

    public function zadanie(){
        return $this->belongsTo(Zadanie::class, 'Zadanie_idZadanie', 'idZadanie');
    }

    public function kurs(){
        return $this->belongsTo(Kurs::class, 'kurs_idkurs', 'idkurs');
    }
}
