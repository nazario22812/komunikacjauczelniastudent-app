<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pytania extends Model
{
    //
    protected $table = 'pytania';
    protected $primaryKey = 'idPytania';

    protected $fillable = [
        'tresc',
        'typPytania',
        'czyWymagane',
        'Ankieta_idAnkieta'
    ];


    public function ankieta(){
        return $this->belongsTo(Ankieta::class, 'Ankieta_idAnkieta', 'idAnkieta');
    }

    public function opcjewybory(){
        return $this->hasMany(OpcjeWyboru::class, ['Pytania_idPytania', 'Pytania_Ankieta_idAnkieta'], ['idPytania', 'Ankieta_idAnkieta']);
    }
}
