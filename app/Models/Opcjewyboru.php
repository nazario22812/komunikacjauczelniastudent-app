<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Opcjewyboru extends Model
{
    //
    protected $table = 'opcjewyboru';
    protected $primaryKey = 'idOpcjeWyboru';

    protected $fillable = [
        'tresc',
        'numerOpcji',
        'Pytania_idPytania',
        'Pytania_Ankieta_idAnkieta'
    ];


    public function pytania(){
        return $this->belongsTo(Pytania::class, ['Pytania_idPytania', 'Pytania_Ankieta_idAnkieta'], ['idPytania', 'Ankieta_idAnkieta']);
    }
}
