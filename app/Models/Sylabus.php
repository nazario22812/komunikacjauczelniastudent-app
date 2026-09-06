<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sylabus extends Model
{
    //
    protected $table = 'sylabus';
    protected $primaryKey = 'idSylabus';
    public $timestamps = false;

    protected $fillable = [
        'iloscGodzin',
        'czyEgzamin',
        'opisPrzedmiotu',
        'warunkiZaliczenia',
        'Przedmiot_idPrzedmiot',
    ];


    public function przedmiot(){
        return $this->belongsTo(Przedmiot::class, 'Przedmiot_idPrzedmiot', 'idPrzedmiot');
    }

    public function literatura(){
        return $this->hasMany(Literatura::class, 'Sylabus_idSylabus', 'idSylabus');
    }
}
