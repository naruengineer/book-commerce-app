import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

//購入履歴検索API
export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId;

  try {
    const Purchases = await prisma.purchase.findMany({
      where: { userId: userId },
    });
    return NextResponse.json(Purchases);
  } catch (err) {
    return NextResponse.json(err);
  }
}
