<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ankieta extends Model
{
    //

    protected $table = 'ankieta';
    protected $primaryKey = 'idAnkieta';


    protected $fillable = [
        'temat',
        'opis'
    ];

    public function user(){
        return $this->belongsToMany(User::class, 'user_has_ankieta', 'Ankieta_idAnkieta', 'User_idUser');
    }

    public function pytania(){
        return $this->hasMany(Pytania::class, 'Ankieta_idAnkieta', 'idAnkieta');
    }
}
