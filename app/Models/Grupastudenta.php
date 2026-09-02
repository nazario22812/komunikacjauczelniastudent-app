<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Grupastudenta extends Model
{
    //
    protected $table = 'grupastudenta';
    protected $primaryKey = 'idGrupaStudenta';

    protected $fillable = [
        'nazwaGrupy',
        'typGrupy',
        'id_nadgrupy',
    ];


    public function student(){
        return $this->belongsToMany(Student::class, 'grupastudenta_has_student', 'GrupaStudenta_idGrupaStudenta', 'Student_idStudent');
    }
    public function nadgrupa(){
        return $this->belongsTo(Grupastudenta::class, 'id_nadgrupy', 'idGrupaStudenta');
    }

    public function planzajec(){
        return $this->hasOne(Planzajec::class, 'GrupaStudenta_idGrupaStudenta', 'idGrupaStudenta');
    }
}
