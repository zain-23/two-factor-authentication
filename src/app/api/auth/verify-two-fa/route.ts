import { db } from "@/lib/db";
import { createSession, decrypt } from "@/lib/session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import speakeasy from "speakeasy";

export const POST = async (req: NextRequest) => {
  try {
    // get code
    const { code } = await req.json();
    // get 2fa cookie and descript
    const twoFaSecret = cookies().get("2fa_challenge")?.value;
    const payload = await decrypt(twoFaSecret);
    // find user and verify code
    const user = await db.user.findUnique({
      where: {
        id: payload?.payload.userId as string,
      },
      select: {
        id: true,
        twoFaSecret: true,
      },
    });

    if (!user || !user.twoFaSecret) {
      return NextResponse.json(
        { error: "You need first login attempt" },
        { status: 400 }
      );
    }

    const isCorrect = speakeasy.totp.verify({
      secret: user.twoFaSecret,
      encoding: "base32",
      token: code,
      window: 1,
    });

    // if code incorrect throw error
    if (!isCorrect) {
      return NextResponse.json({ error: "Incorrect Code" }, { status: 400 });
    }
    // create session and login in user
    cookies().delete("2fa_challenge");
    await createSession(user.id);
    return NextResponse.redirect(new URL("/profile", req.nextUrl));
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Something went wrong" },
      { status: 500 }
    );
  }
};
