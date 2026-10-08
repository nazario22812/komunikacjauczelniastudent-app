<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Zajecie extends Model
{
    //
    protected $table = 'zajęcie';
    protected $primaryKey = 'idZajęcie';
    public $timestamps = false;

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

    

    public function planzajec(){
        return $this->belongsTo(PlanZajec::class, 'PlanZajec_idPlanZajec', 'idPlanZajec');
    }

    

    public function rezerwacja(){
        return $this->hasMany(Rezerwacja::class, 'Zajęcie_idZajęcie', 'idZajęcie');

    }
}
