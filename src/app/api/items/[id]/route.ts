import { em, withDb } from "@/lib/db";
import { Item } from "@/lib/db/item";

export const runtime = "nodejs";

export const GET = withDb(async (
    _request: Request,
    { params }: { params: Promise<{ id: string }> },
) => {
    const { id } = await params;
    const itemId = Number(id);
    const item = await em.findOne(Item, { id: itemId });

    if (!item) {
        return Response.json({ error: "Položka nebyla nalezena." }, { status: 404 });
    }

    return Response.json({ id: item.id, name: item.name });
});
