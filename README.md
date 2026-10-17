
# Instalacja projektu

### Pobieranie z git hub'a
Po pobraniu repozytirum należy:

1. pobrać wszystkie niezbędne zależności za pomocą polecenia 
    ```bash
    composer install
    ```
2. skopiować treść pliku .env.example do .env
    ```bash
    cp .env.example .env
    ```
3. uruchomić kontenery 
    ```bash
    docker compose up -d --build
    ```
4. konfiguracja beckendu i bazy danych
    ```bash
    docker compose exec laravel php artisan key:generate
    docker compose exec laravel php artisan migrate:fresh --seed
    docker compose exec laravel php artisan storage:link
    ```
5. konfiguracja frontendu 
    ```bash
    docker compose exec react npm install
    docker compose exec react npm run build
    ```
6. konfiguracja tabel w bazie danych jest ręczna

