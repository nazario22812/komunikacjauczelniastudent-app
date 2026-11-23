# MojaUczelnia

**System internetowy z klientem mobilnym wspomagający komunikację uczelni i studentów.**

Repozytorium zawiera backend Laravel, interfejs webowy React/Inertia.js oraz trasy API przeznaczone do komunikacji z klientem mobilnym.

## Wymagania

- Windows 11 z Docker Desktop (uruchomionym silnikiem Docker) **lub** Ubuntu z Docker Engine i wtyczką Compose.
- Git.
- Wolne porty: `8000` (Laravel), `5173` (Vite), `8080` (phpMyAdmin), `3307` (MySQL na hoście).
- Plik SQL ze schematem aplikacji i — w razie potrzeby — danymi przykładowymi. **Uwaga:** pełny schemat aplikacji nie jest tworzony przez standardowe migracje Laravel.

## Instalacja i uruchomienie aplikacji

### 1. Pobranie repozytorium

```bash
git clone https://github.com/nazario22812/komunikacjauczelniastudent-app.git
cd komunikacjauczelniastudent-app
```

### 2. Przygotowanie `.env`

**Windows — PowerShell:**

```powershell
Copy-Item .env.example .env
```

**Ubuntu — terminal:**

```bash
cp .env.example .env
```

W `.env` sprawdź konfigurację MySQL używaną **wewnątrz Docker Compose**:

```dotenv
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=komuniakcjauczelniastudent
DB_USERNAME=root
DB_PASSWORD=
```

> Nazwa `komuniakcjauczelniastudent` odpowiada obecnej wartości `MYSQL_DATABASE` w `docker-compose.yaml` (zachowano pisownię z projektu). Konfiguracja z pustym hasłem jest przeznaczona wyłącznie do lokalnego środowiska deweloperskiego.

### 3. Uruchomienie kontenerów

Na Windows (PowerShell) i Ubuntu polecenie jest takie samo:

```bash
docker compose up -d --build
```

Zainstaluj zależności PHP **wewnątrz kontenera**:

```bash
docker compose exec laravel composer install
```

Zainicjalizuj klucz aplikacji:

```bash
docker compose exec laravel php artisan key:generate
```

Przygotuj dowiązanie do plików publicznych:

```bash
docker compose exec laravel php artisan storage:link
```

### 4. Przygotowanie bazy danych

Otwórz `http://localhost:8080` (phpMyAdmin). Wybierz bazę `komuniakcjauczelniastudent` utworzoną przez Docker i zaimportuj odpowiedni plik SQL zawierający schemat projektu. W razie potrzeby zaimportuj dane przykładowe.

**Nie wykonuj `php artisan migrate:fresh --seed` na bazie z danymi projektu.** Polecenie usuwa istniejące tabele. Ponadto standardowe migracje z repozytorium nie odtwarzają całej niestandardowej struktury projektu.

### 5. Frontend

Kontener `react` uruchamia automatycznie `npm install --force` oraz serwer Vite. W razie konieczności można ręcznie wykonać:

```bash
docker compose exec react npm install
docker compose exec react npm run build
```

### 6. Adresy lokalne

| Usługa | Adres |
|---|---|
| Aplikacja Laravel | http://localhost:8000 |
| Vite (frontend — serwer deweloperski) | http://localhost:5173 |
| phpMyAdmin | http://localhost:8080 |
| MySQL z systemu hosta | localhost:3307 |

Zatrzymanie kontenerów: `docker compose down` (bez flagi `-v`, która usunęłaby wolumen bazy danych).

## Uruchamianie testów automatycznych

Projekt wykorzystuje PHPUnit. Testy jednostkowe znajdują się w `tests/Unit`, a testy funkcjonalne i integracyjne w `tests/Feature`.

### Przygotowanie środowiska testowego

1. Utwórz **osobną** bazę MySQL w istniejącym kontenerze (nie jest potrzebny drugi kontener):

   ```bash
   docker compose exec mysql mysql -uroot -e "CREATE DATABASE IF NOT EXISTS komuniakcjauczelniastudent_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
   ```

2. Zaimportuj do `komuniakcjauczelniastudent_test` schemat aplikacji i **fikcyjne dane testowe**. Potrzebne są między innymi użytkownicy z rolami student, prowadzący i pracownik dziekanatu oraz dane kursów. Testy używają identyfikatorów `user.idUser`, a nie `student.idStudent` lub `prowadzacy.idProwadzacy`.
3. Utwórz `.env.testing` z poprawnym `APP_KEY` oraz danymi dostępu do testowej bazy. Nie publikuj haseł ani tego pliku w GitHub. Przykładowe ustawienia:

   ```dotenv
   APP_ENV=testing
   DB_CONNECTION=mysql
   DB_HOST=mysql
   DB_PORT=3306
   DB_DATABASE=komuniakcjauczelniastudent_test
   DB_USERNAME=root
   DB_PASSWORD=
   SESSION_DRIVER=array
   CACHE_STORE=array
   QUEUE_CONNECTION=sync
   ```

   Klucz można wygenerować w środowisku testowym poleceniem:

   ```bash
   docker compose exec -e APP_ENV=testing laravel php artisan key:generate --env=testing
   ```

4. Utwórz plik `phpunit.integration.xml` jako kopię `phpunit.xml` i zmień konfigurację połączenia z bazą testową:

   ```xml
   <env name="DB_CONNECTION" value="mysql"/>
   <env name="DB_HOST" value="mysql"/>
   <env name="DB_PORT" value="3306"/>
   <env name="DB_DATABASE" value="komuniakcjauczelniastudent_test"/>
   ```

   Pozostałe ustawienia PHPUnit pozostaw bez zmian. Przed wykonaniem testów **zweryfikuj**, że konfiguracja na pewno wskazuje na bazę zakończoną `_test`.

> **Uwaga:** drugi zestaw testów integracyjnych i `phpunit.integration.xml` zostały przygotowane osobno; jeżeli nie znajdują się jeszcze w Twoim lokalnym katalogu `tests/Feature`, należy je najpierw dodać. Wersja repozytorium GitHub może różnić się od lokalnej kopii.

### Windows — PowerShell

Otwórz PowerShell w katalogu głównym repozytorium i uruchom kontenery:

```powershell
docker compose up -d
```

**Tylko testy jednostkowe:**

```powershell
docker compose exec laravel ./vendor/bin/phpunit -c phpunit.xml --testsuite Unit
```

**Wszystkie dostępne testy (Unit, Feature i Integration):**

```powershell
docker compose exec -e APP_ENV=testing -e MOJA_INTEGRATION=1 -e MOJA_TEST_STUDENT_USER_ID=1 -e MOJA_TEST_TEACHER_USER_ID=2 -e MOJA_TEST_DEAN_USER_ID=3 laravel ./vendor/bin/phpunit -c phpunit.integration.xml --display-skipped
```

Identyfikatory `1`, `2`, `3` są **przykładowe**: zastąp je prawdziwymi identyfikatorami `idUser` odpowiednich użytkowników w testowej bazie.

### Ubuntu — terminal Bash

Uruchom kontenery:

```bash
docker compose up -d
```

**Tylko testy jednostkowe:**

```bash
docker compose exec laravel ./vendor/bin/phpunit -c phpunit.xml --testsuite Unit
```

**Wszystkie dostępne testy (Unit, Feature i Integration):**

```bash
docker compose exec \
  -e APP_ENV=testing \
  -e MOJA_INTEGRATION=1 \
  -e MOJA_TEST_STUDENT_USER_ID=1 \
  -e MOJA_TEST_TEACHER_USER_ID=2 \
  -e MOJA_TEST_DEAN_USER_ID=3 \
  laravel ./vendor/bin/phpunit \
  -c phpunit.integration.xml \
  --display-skipped
```

Także tutaj wpisz właściwe identyfikatory `idUser` z testowej bazy.

### Interpretacja wyników

- `PASS` / `.` — test zakończył się pomyślnie.
- `FAIL` / `F` — asercja nie została spełniona.
- `ERROR` / `E` — błąd uruchomienia lub konfiguracji.
- `SKIP` / `S` — test został pominięty, np. z powodu braku danych testowych.

Wyświetlenie pominiętych testów: `--display-skipped`. Zestaw testów sprawdza tylko scenariusze, dla których przygotowano metody testowe; jego wykonanie nie oznacza automatycznego pokrycia wszystkich funkcji aplikacji.

## Znane ograniczenia środowiska

- W `docker-compose.yaml` dyrektywa `version: '3.8'` jest przestarzała i może zostać usunięta.
- Generowanie prawdziwych obrazów JPEG podczas testów `UploadedFile::fake()->image()` wymaga obsługi JPEG w rozszerzeniu PHP GD. Sama obecność rozszerzenia `gd` nie gwarantuje funkcji `imagejpeg()`; obraz kontenera może wymagać przebudowania z obsługą `libjpeg`.
- Testy integracyjne wykorzystujące transakcje zwykle wycofują zmiany w bazie, lecz nie wszystkie skutki uboczne (np. zapisane pliki) są objęte transakcją. Z tego powodu należy używać oddzielnej bazy i dysku testowego.
