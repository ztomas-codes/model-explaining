import { Migration } from "@mikro-orm/migrations";

export class Migration20261017000000 extends Migration {
  override async up(): Promise<void> {
    this.addSql('create table "notes" ("id" serial primary key, "content" text not null, "created_at" timestamptz not null default current_timestamp);');
  }

  override async down(): Promise<void> {
    this.addSql('drop table if exists "notes";');
  }
}
