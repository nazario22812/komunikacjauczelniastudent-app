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
        'Podanie_idPodanie'
    ];

   

    public function podanie(){
        return $this->belongsTo(Podanie::class, 'Podanie_idPodanie', 'idPodanie');
    }
    public function plik(){
        return $this->belongsTo(Kurs::class, 'Kurs_idkurs', 'idkurs');
    }


}
