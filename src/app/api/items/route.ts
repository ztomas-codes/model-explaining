import { db, em, withDb } from "@/lib/db";
import { Item } from "@/lib/db/item";

export const runtime = "nodejs";

export const GET = withDb(async () => {
    const items = await em.findAll(Item);

    return Response.json(items.map((item) => ({ id: item.id, name: item.name })));
});

export const POST = withDb(async (request: Request) => {
    const { name } = await request.json();

    const item = em.create(Item, { name: name });
    await db.save(item);

    return Response.json({ id: item.id, name: item.name }, { status: 201 });
});
