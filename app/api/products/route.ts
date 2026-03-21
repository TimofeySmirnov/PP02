import { NextRequest, NextResponse } from "next/server";

import { getSession } from "@/lib/auth/session";
import { searchProducts } from "@/lib/products/search";

export async function GET(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const query = request.nextUrl.searchParams.get("query") ?? "";
    const products = await searchProducts(query, session.userId);

    return NextResponse.json(products);
  } catch (error) {
    console.error("Product search failed:", error);
    return NextResponse.json([], { status: 200 });
  }
}
