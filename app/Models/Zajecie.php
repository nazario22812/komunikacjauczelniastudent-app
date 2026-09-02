<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Zajecie extends Model
{
    //
    protected $table = 'zajęcie';
    protected $primaryKey = 'idZajęcie';

    protected $fillable = [
        'DzienTygodnia',
        'Parzystosc',
        'TypZajec',
        'LiczbaGodzin',
        'Predmiot_idPrzedmiot',
        'PlanZajec_idPlanZajec',
        'Sala_idSala',
        'Sala_Budynek_idBudynek'
    ];



    public function przedmiot(){
        return $this->belongsTo(Przedmiot::class, 'Predmiot_idPrzedmiot', 'idPrzedmiot');
    }

    public function plik(){
        return $this->belongsToMany(Plik::class, 'plik_has_zajęcie', 'Plik_idPlik', 'Zajęcie_idZajęcie', 'Zajęcie_PlanZajec_idPlanZajec', 'Zajęcie_Sala_idSala', 'Zajęcie_Sala_Budynek_idBudynek');
    }

    public function planzajec(){
        return $this->belongsTo(PlanZajec::class, 'PlanZajec_idPlanZajec', 'idPlanZajec');
    }

    public function zadanie(){
        return $this->hasMany(Zadanie::class, 'Zajęcie_idZajęcie', 'idZajęcie');
    }
}
