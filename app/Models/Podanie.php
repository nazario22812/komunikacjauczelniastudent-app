<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Podanie extends Model
{
    //
    protected $table = 'podanie';
    protected $primaryKey = 'idPodanie';

    protected $fillable = [
        'temat',
        'tresc',
        'data',
        'autor',
        'status',
        'odpowiedz'
    ];

    public function user(){
        return $this->belongsTo(User::class, 'autor', 'idUser');
    }
}
