<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rezerwacja extends Model
{
    //

    protected $table = 'rezerwacja';
    protected $primaryKey = 'idRezerwacja';

    protected $fillable = [
        'data',
        'GodzinaRozpoczecia',
        'GodzinaZakonczenia',
        'typWydarzenia',
        'statusWydarzenia',
        'Zajęcie_idZajęcie',
        'Zajęcie_PlanZajec_idPlanZajec',
        'Prowadzacy_idProwadzacy',
        'Sala_idSala',
        'Sala_Budynek_idBudynek'
    ];

    public function prowadzacy(){
        return $this->belongsTo(Prowadzacy::class, 'Prowadzacy_idProwadzacy', 'idProwadzacy');
    }

    public function sala(){
        return $this->belongsTo(Sala::class, 'Sala_idSala', 'idSala');
    }
}
