<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Budynek extends Model
{
    //
    protected $table = 'budynek';
    protected $primaryKey = 'idBudynek';
    
    protected $fillable = [
        'nazwa',
        'nrBudynku',
        'ulica',
        'GodzinaOtwarcia',
        'Wydzial_idWydzial'
    ];


    public function wydzial(){
        return $this->belongsTo(Wydzial::class, 'Wydzial_idWydzial', 'idWydzial');
    }

    public function sala(){
        return $this->hasMany(Sala::class, 'Budynek_idBudynek', 'idBudynek');
    }
}
