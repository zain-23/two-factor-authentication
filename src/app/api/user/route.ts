import { db } from "@/lib/db";
import { decrypt, getCookie } from "@/lib/session";
import { NextResponse } from "next/server";

export const GET = async () => {
  const session = getCookie();
  const payload = await decrypt(session);

  try {
    const user = await db.user.findUnique({
      where: {
        id: payload?.payload.userId as string,
      },
      select: {
        email: true,
        fullname: true,
        isTwoFaEnabled: true,
      },
    });
    return NextResponse.json({ data: user }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Something went wrong" },
      { status: 500 }
    );
  }
};
