<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Literatura extends Model
{
    //
    protected $table = 'literatura';
    protected $primaryKey = 'idLiteratura';
    public $timestamps = false;

    protected $fillable = [
        'nazwa',
        'opis',
        'Sylabus_idSylabus',
    ];

    public function sylabus(){
        return $this->belongsTo(Sylabus::class, 'Sylabus_idSylabus', 'idSylabus');
    }
}
