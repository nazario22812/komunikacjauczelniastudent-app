<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kierunek extends Model
{
    //

    protected $table = 'kierunek';
    protected $primaryKey = 'idKierunek';
    public $timestamps = false;


    protected $fillable = [
        'nazwa',
        'Wydzial_idWydzial',
    ];

    public function wydzial(){
        return $this->belongsTo(Wydzial::class, 'Wydzial_idWydzial', 'idWydzial');
    }

    public function student(){
        return $this->hasMany(Student::class, 'Kierunek_idKierunek', 'idKierunek');

    }

    
}
