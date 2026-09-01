<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Auth\Authenticatable as Autthenticatable;

class User extends Model implements \Illuminate\Contracts\Auth\Authenticatable
{
    //
    use Autthenticatable;

    protected $table = 'user';
    protected $primaryKey = 'idUser';

    protected $fillable = [
        'name',
        'surname',
        'email',
        'password',
        'numerTelefonu',
        'kontoBankowe',
        'dataUrodzenia',
        'ustawienia',
    ];

    protected $hidden = [
        'password',
    ];


    public function student()
    {
        return $this->hasOne(Student::class, 'User_idUser', 'idUser');
    }

    public function komunikat(){
        return $this->belongsToMany(Komunikat::class, 'user_has_komunikat', 'User_idUser', 'Komunikat_idKomunikat');
    }

    public function ankieta(){
        return $this->belongsToMany(Ankieta::class, 'user_has_ankieta', 'User_idUser', 'Ankieta_idAnkieta');
    }
    public function odpowiedz(){
        return $this->hasMany(Podanie::class, 'autor', 'idUser');
    }

    public function prowadzacy(){
        return $this->hasOne(Prowadzacy::class, 'User_idUser', 'idUser');
    }

    public function pracownikdziekanatu(){
        return $this->hasOne(PracownikDziekanatu::class, 'User_idUser', 'idUser');
    }
}