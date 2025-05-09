# EveryMatrixProject

Ovo je jednostavna web aplikacija u stilu Facebook Marketplacea, izrađena pomoću Vue.js, Node.js i PostgreSQL-a.

## Funkcionalnosti

- Registracija i prijava korisnika
- Objavljivanje, uređivanje i brisanje vlastitih oglasa
- Pregled svih oglasa
- Pregled profila drugih korisnika i njihovih oglasa
- Privatna komunikacija (chat) između korisnika

## Tehnologije

- **Frontend:** Vue.js
- **Backend:** Node.js (Express)
- **Baza podataka:** PostgreSQL

## Pokretanje projekta

1. **Kloniraj repozitorij:**
  - git clone https://github.com/dvucina22/EveryMatrixProject.git
2. **Instaliraj ovisnosti:**
  - cd EveryMatrixProject
  - cd backend
  - npm install
  - cd ../frontend
  - npm install
3. **Konfiguriraj bazu podataka:**
  - Postavi .env datoteku s pristupnim podacima za PostgreSQL
4. **Pokreni aplikaciju:**
  - Backend
    - cd backend
    - node server.js
  - Frontend
    - cd frontend
    - npm run serve
