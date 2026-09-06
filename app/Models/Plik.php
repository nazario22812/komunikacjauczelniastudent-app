<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Plik extends Model
{
    //

    protected $table = 'plik';
    protected $primaryKey = 'idPlik';
    public $timestamps = false;

    protected $fillable = [
        'nazwa',
        'typ',
        'rozmiar',
        'dataTworzenia',
    ];

    public function zajecie(){
        return $this->belongsToMany(Zajecie::class, 'plik_has_zajęcie', 'Plik_idPlik', 'Zajęcie_idZajęcie', 'Zajęcie_PlanZajec_idPlanZajec', 'Zajęcie_Sala_idSala', 'Zajęcie_Sala_Budynek_idBudynek');
    }
}
