<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sala extends Model
{
    //

    protected $table = 'sala';
    protected $primaryKey = 'idSala';

    protected $fillable = [
        'numerSali',
        'Pojemnosc',
        'Wyposazenie',
        'Budynek_idBudynek',

    ];


    public function budynek(){
        return $this->belongsTo(Budynek::class, 'Budynek_idBudynek', 'idBudynek');
    }
}
