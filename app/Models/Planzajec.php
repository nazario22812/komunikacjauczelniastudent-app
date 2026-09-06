<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Planzajec extends Model
{
    //
    protected $table = 'planzajec';
    protected $primaryKey = 'idPlanZajec';
    public $timestamps = false;

    protected $fillable = [
        'rok',
        'Semestr',
        'trybStudiow',
        'stopien',
        'Specjalnosc',
        'GrupaStudenta_idGrupaStudenta',
    ];


    public function zajecie(){
        return $this->hasMany(Zajecie::class, 'PlanZajec_idPlanZajec', 'idPlanZajec');
    }
    public function grupastudenta(){
        return $this->belongsTo(Grupastudenta::class, 'GrupaStudenta_idGrupaStudenta', 'idGrupaStudenta');
    }
}
