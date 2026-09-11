<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
class Student extends Model
{
    protected $table  = 'student';
    protected $primaryKey = 'idStudent';
    public $timestamps = false;

    protected $fillable = [
        'index',
        'semester',
        'stopien',
        'trybStudiow',
        'rok',
        'iloscPunktowEcts',
        'Specjalnosc',
        'User_idUser',
        'Kierunek_idKierunek',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'User_idUser', 'idUser');
        
    }
    public function kierunek()
    {
        return $this->belongsTo(Kierunek::class, 'Kierunek_idKierunek', 'idKierunek');
    }


    public function grupastudenta(){
        return $this->belongsToMany(
            Grupastudenta::class,
            'grupastudenta_has_student', 
            'Student_idStudent',
            'GrupaStudenta_idGrupaStudenta', 
        );
    }

    public function platnosc(){
        return $this->hasMany(Platnosc::class, 'Student_idStudent', 'idStudent');
    }

    public function ocena(){
        return $this->hasMany(Ocena::class, 'idStudent', 'idStudent');
    }

    public function zadanie(){
        return $this->belongsToMany(Zadanie::class, 'student_has_zadanie', 'Student_idStudent', 'Zadanie_idZadanie');
    }


}
