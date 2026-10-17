import { defineEntity, p } from "@mikro-orm/postgresql";

export const Note = defineEntity({
  name: "Note",
  tableName: "notes",
  properties: {
    id: p.integer().primary(),
    content: p.text(),
    createdAt: p.datetime().defaultRaw("current_timestamp"),
  },
});
