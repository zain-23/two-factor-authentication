import { db } from "@/lib/db";
import { decrypt, getCookie } from "@/lib/session";
import { NextResponse } from "next/server";
import speakeasy from "speakeasy";

export const POST = async (req: Request) => {
  try {
    const { code } = await req.json();
    const session = getCookie();
    const payload = await decrypt(session);
    const userId = payload?.payload.userId;

    if (!userId) {
      throw new Error("UnAuthorize");
    }
    // Find user
    const user = await db.user.findUnique({
      where: {
        id: userId as string,
      },
      select: {
        isTwoFaEnabled: true,
        twoFaSecret: true,
      },
    });
    if (!user?.twoFaSecret) {
      return NextResponse.json(
        { error: "To enabled Two factor authentication scan QrCode" },
        { status: 400 }
      );
    }
    // Check code is correct with user secret in database
    const isVerfiy = speakeasy.totp.verify({
      secret: user.twoFaSecret,
      encoding: "base32",
      token: code,
      window: 1,
    });
    // If code in correct throw error
    if (!isVerfiy) {
      return NextResponse.json({ error: "Incorrect Code" }, { status: 400 });
    }
    // enabled two factor authentication
    await db.user.update({
      where: {
        id: userId as string,
      },
      data: {
        isTwoFaEnabled: true,
      },
    });
    return NextResponse.json(
      { message: "Congratulation Two Factor Authentication enabled" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Something went wrong" },
      { status: 500 }
    );
  }
};
