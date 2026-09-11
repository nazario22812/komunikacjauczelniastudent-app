<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Grupastudenta extends Model
{
    //
    protected $table = 'grupastudenta';
    protected $primaryKey = 'idGrupaStudenta';
    public $timestamps = false;


    protected $fillable = [
        'nazwaGrupy',
        'typGrupy',
        'id_nadgrupy',
        'Kierunek_idKierunek',
        'Kierunek_Wydzial_idWydzial'
    ];


    public function grupastudenta(){
        return $this->belongsToMany(
            Student::class, 
            'grupastudenta_has_student', 
            'GrupaStudenta_idGrupaStudenta', 
            'Student_idStudent'
        );
    }
    public function nadgrupa(){
        return $this->belongsTo(Grupastudenta::class, 'id_nadgrupy', 'idGrupaStudenta');
    }

    public function planzajec(){
        return $this->hasOne(Planzajec::class, 'GrupaStudenta_idGrupaStudenta', 'idGrupaStudenta');
    }

    public function kierunek(){
        return $this->belongsTo(Kierunek::class, ['Kierunek_idKierunek', 'idKierunek'],['Kierunek_Wydzial_idWydzial', 'Wydzial_idWydzial']);
    }
}
