<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pracownikdziekanatu extends Model
{
    //
    protected $table = 'pracownikdziekanatu';
    protected $primaryKey = 'idPracownikDziekanatu';
    public $timestamps = false;

    protected $fillable = [
        'Odpowiedzialnosc',
        'User_idUser',
    ];

    public function user(){
        return $this->belongsTo(User::class, 'User_idUser', 'idUser');
    }

    public function platnosc(){
        return $this->hasMany(Platnosc::class, 'PracownikDziekanatu_idPracownikDziekanatu', 'idPracownikDziekanatu');
    }
}
