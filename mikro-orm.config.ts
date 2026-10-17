import "dotenv/config";
import { defineConfig } from "@mikro-orm/postgresql";
import { Migrator } from "@mikro-orm/migrations";
import { Note } from "./src/lib/db/note";
import { User } from "./src/lib/db/user";
import { Item } from "./src/lib/db/item";
import { Migration20261017000000 } from "./migrations/Migration20261017000000";
import { Migration20261017000001 } from "./migrations/Migration20261017000001";

export default defineConfig({
  clientUrl: process.env.DATABASE_URL ?? "postgresql://app:app@localhost:5432/model_explaining",
  entities: [Note, User, Item],
  extensions: [Migrator],
  migrations: {
    path: "./migrations",
    migrationsList: [Migration20261017000000, Migration20261017000001],
  },
});
