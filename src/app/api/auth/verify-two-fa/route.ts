import { db } from "@/lib/db";
import { createSession, decrypt } from "@/lib/session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import speakeasy from "speakeasy";

export const POST = async (req: Request) => {
  try {
    // get code
    const { code } = await req.json();
    // get 2fa cookie and descript
    const twoFaSecret = cookies().get("2fa_challenge")?.value;
    const payload = await decrypt(twoFaSecret);
    // find user and verify code
    if (!payload) {
      return NextResponse.json(
        { error: "You need first login attempt" },
        { status: 400 }
      );
    }
    const user = await db.user.findUnique({
      where: {
        id: payload.payload.userId as string,
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
    console.log("isCorrect", isCorrect);

    // if code incorrect throw error
    if (!isCorrect) {
      return NextResponse.json({ error: "Incorrect Code" }, { status: 400 });
    }
    // create session and login in user
    await createSession(user.id);
    cookies().delete("2fa_challenge");
    return NextResponse.json({ message: "Done" }, { status: 200 });
  } catch (error) {
    console.error("ERROR", error);
    return NextResponse.json(
      { error: (error as Error).message || "Something went wrong" },
      { status: 500 }
    );
  }
};
