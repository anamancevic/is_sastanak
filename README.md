# IS SASTANAK

Informacioni sistem za planiranje i vođenje sastanaka.

## Tehnologije
- **Backend:** Spring Boot (Java 21), Spring Data JPA
- **Baza:** MySQL
- **Frontend:** React + Vite
- **Kontejnerizacija:** Docker (docker-compose)

Aplikacija:
   - Frontend: http://localhost:5173
   - Backend (API): http://localhost:8080

   ## Test nalozi
| Uloga | Korisničko ime | Lozinka |
|---|---|---|
| Administrator | admin | admin123 |
| Rukovodilac | milos | test123 |
| Zapisničar | jelena | test123 |
| Učesnik | stefan | test123 |

## Struktura projekta
- `is_sastanak/` — backend (Spring Boot)
- `is-sastanak-frontend/` — frontend (React + Vite)
- `is_sastanak.sql` — baza sa test podacima
- `docker-compose.yml` — Docker konfiguracija
- `dijagrami/` — UML dijagrami (use-case, kontekst, DFD, dekompozicija, struktura proizvoda)