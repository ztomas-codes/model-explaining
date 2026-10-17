import { defineEntity, p } from "@mikro-orm/postgresql";

export const User = defineEntity({
  name: "User",
  tableName: "users",
  properties: {
    id: p.integer().primary(),
    name: p.string(),
  },
});
