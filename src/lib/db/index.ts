import "server-only";
import { AsyncLocalStorage } from "node:async_hooks";
import { MikroORM, type EntityManager } from "@mikro-orm/postgresql";
import config from "../../../mikro-orm.config";

const globalForOrm = globalThis as typeof globalThis & {
  ormPromise?: Promise<MikroORM>;
};

// Cache the initialization promise across dev reloads and concurrent requests.
export function getOrm(): Promise<MikroORM> {
  return (globalForOrm.ormPromise ??= MikroORM.init(config).catch((error: unknown) => {
    delete globalForOrm.ormPromise;
    throw error;
  }));
}

const entityManagers = new AsyncLocalStorage<EntityManager>();

// Resolve the manager for the current request instead of sharing a unit of work.
export const em = new Proxy({} as EntityManager, {
  get(_target, property) {
    const manager = entityManagers.getStore();
    if (!manager) {
      throw new Error("Use em inside a handler wrapped with withDb().");
    }

    const value = Reflect.get(manager, property, manager);
    return typeof value === "function" ? value.bind(manager) : value;
  },
});

export const db = {
  async save<Entity extends object>(entity: Entity): Promise<Entity> {
    em.persist(entity);
    await em.flush();
    return entity;
  },
};

export function withDb<Args extends unknown[], Result>(
  handler: (...args: Args) => Promise<Result>,
) {
  return async (...args: Args): Promise<Result> => {
    const orm = await getOrm();
    return entityManagers.run(orm.em.fork(), () => handler(...args));
  };
}
