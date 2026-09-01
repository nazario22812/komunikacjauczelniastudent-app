<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Prowadzacy extends Model
{
    //
    protected $table = 'prowadzacy';
    protected $primaryKey = 'idProwadzacy';


    protected $fillable = [
        'TytulNaukowy',
        'katedra',
    ];

    public function user(){
        return $this->belongsTo(User::class, 'User_idUser', 'idUser');
    }

    // public function zajecie(){
    //     return $this->be(Zajecie::class, 'Prowadzacy_idProwadzacy', 'idProwadzacy');
    // }
}
