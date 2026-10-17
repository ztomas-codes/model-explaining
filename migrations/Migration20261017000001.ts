import { Migration } from "@mikro-orm/migrations";

export class Migration20261017000001 extends Migration {
  override async up(): Promise<void> {
    this.addSql('create table "users" ("id" serial primary key, "name" varchar(255) not null);');
    this.addSql('create table "items" ("id" serial primary key, "name" varchar(255) not null);');
  }

  override async down(): Promise<void> {
    this.addSql('drop table if exists "items";');
    this.addSql('drop table if exists "users";');
  }
}
