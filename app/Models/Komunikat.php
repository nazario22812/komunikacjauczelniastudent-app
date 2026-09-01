<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Komunikat extends Model
{
    //
    protected $table = 'komunikat';
    protected $primaryKey = 'idKomunikat';


    protected $fillable = [
        'temat',
        'tresc',
        'odbiorcy',
        'nadawca',
    ];

    public function user(){
        return $this->belongsToMany(User::class, 'user_has_komunikat', 'Komunikat_idKomunikat', 'User_idUser');
    }

}
