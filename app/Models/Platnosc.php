<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Platnosc extends Model
{
    //
    protected $table = 'platnosc';
    protected $primaryKey = 'idPlatnosc';

    protected $fillable = [
        'kwota',
        'termin',
        'data',
        'tytul',
        'czyOplacona',
        'Student_idStudent',
        'PracownikDziekanatu_idPracownikDziekanatu'
    ];

    public function student(){
        return $this->belongsTo(Student::class, 'Student_idStudent', 'idStudent');
    }
    public function pracownikdziekanatu(){
        return $this->belongsTo(Pracownikdziekanatu::class, 'PracownikDziekanatu_idPracownikDziekanatu', 'idPracownikDziekanatu');
    }
}
