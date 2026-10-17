# Model explaining

Next.js App Router, TypeScript, Effect 4, MikroORM 7 a PostgreSQL 17.

## Spuštění v Dockeru

```sh
docker compose up --build -d
```

Výchozí adresa aplikace je http://localhost:3000. V tomto pracovním prostředí je v lokálním `.env` nastaven `APP_PORT=3001`, protože port 3000 už používá jiná aplikace. Aktuálně tedy otevři http://localhost:3001. Endpoint `/api/health` provede přes Effect a MikroORM dotaz na tabulku `notes`. Vrací HTTP 200 při úspěchu a HTTP 503 při chybě databáze.

Compose počká na zdravou databázi a před spuštěním Next.js aplikuje migrace. Next.js běží přes `next dev` s hot reloadem. Zdrojové soubory jsou připojené z aktuální složky. `node_modules`, `.next` a data PostgreSQL mají samostatné volumes. Při startu aplikace se spustí `npm ci`, aby závislosti odpovídaly lockfilu.

```sh
docker compose logs -f nextjs
docker compose down
```

`docker compose down` zachová data. `docker compose down -v` smaže všechny volumes projektu včetně databáze.

## pgAdmin

pgAdmin běží na http://localhost:5050. Přihlašovací e-mail je `admin@example.com`, heslo `admin`. Port a přihlášení lze nastavit přes `PGADMIN_PORT`, `PGADMIN_EMAIL` a `PGADMIN_PASSWORD` v `.env`.

Server `Model explaining` je přednastavený. Při prvním připojení zadej heslo PostgreSQL, výchozí hodnota je `app`. Definice serveru se importuje při prvním spuštění. Při pozdější změně databázového uživatele nebo názvu databáze uprav i připojení v pgAdmin. Nastavení pgAdmin se uchovává ve volume `pgadmin_data`. Přihlašovací údaje správce se z prostředí nastavují pouze při vytvoření tohoto volume.

Konfigurace používá oficiální [Docker image pgAdmin](https://www.pgadmin.org/docs/pgadmin4/latest/container_deployment.html).

## Nastavení

Výchozí hodnoty fungují bez `.env`. Pro změnu portů či přihlašovacích údajů zkopíruj `.env.example` do `.env`. PostgreSQL je z hostitele dostupné na `localhost:5432`, databáze `model_explaining`, uživatel a heslo `app`. Aplikace uvnitř Compose používá adresu `postgres:5432`. Porty jsou dostupné pouze na lokálním rozhraní. Výchozí přihlašovací údaje slouží pro lokální vývoj.

Docker síť používá rozsah `10.251.241.0/24`, protože na tomto stroji jsou výchozí Docker rozsahy vyčerpané. Při kolizi s jinou sítí změň `COMPOSE_SUBNET` v `.env`.

## Lokální vývoj bez Next.js kontejneru

Vyžaduje Node.js 22.17 nebo novější.

```sh
cp .env.example .env
npm ci
docker compose up -d postgres
npm run db:migrate
npm run dev
```

Pokud změníš port nebo přihlašovací údaje PostgreSQL, uprav i `DATABASE_URL` v `.env` pro příkazy běžící na hostiteli.

## Databáze

Ukázková entita je v `src/lib/db/note.ts`, konfigurace v `mikro-orm.config.ts`. ORM sdílí inicializaci napříč dev reloady a endpoint používá vlastní fork entity manageru pro každý požadavek.

```sh
docker compose exec nextjs npm run db:migration:create
```

Nově vytvořenou migraci importuj do `mikro-orm.config.ts` a přidej do `migrationsList`. Pak ji aplikuj:

```sh
docker compose exec nextjs npm run db:migrate
```

## Kontroly

```sh
npm run typecheck
npm run lint
npm run build
```

Použité vzory vycházejí z [dokumentace Next.js](https://nextjs.org/docs/app/getting-started/installation), [integrace MikroORM s Next.js](https://mikro-orm.io/docs/usage-with-nextjs) a [dokumentace Effect](https://effect.website/docs).
