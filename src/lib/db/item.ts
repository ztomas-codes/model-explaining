import { defineEntity, p } from "@mikro-orm/postgresql";

export const Item = defineEntity({
  name: "Item",
  tableName: "items",
  properties: {
    id: p.integer().primary(),
    name: p.string(),
  },
});
