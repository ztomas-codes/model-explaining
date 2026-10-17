export async function GET() {
    return Response.json(
      { status: "error", database: "unavailable" },
      { status: 503 }
    );
}
