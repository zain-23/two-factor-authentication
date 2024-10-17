import { db } from "@/lib/db";
import { createSession, encrypt } from "@/lib/session";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { email, password } = await req.json();
    // Check account exist with this email ? "Account not exist with this email"
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return NextResponse.json({ error: "Email not found" }, { status: 404 });
    }
    // Decrypt Password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    // Check Password is correct ? "Incorrect Password"
    if (!isPasswordCorrect) {
      return NextResponse.json(
        { error: "Incorrect Password" },
        { status: 400 }
      );
    }
    // Check Two Factor Authentication enabled ? "Redirect 2Fa page"
    if (user.isTwoFaEnabled) {
      // five minute
      const expireDate = new Date(Date.now() + 5 * 60 * 1000);
      const session = await encrypt({ userId: user.id });
      await cookies().set("2fa_challenge", session, {
        httpOnly: true,
        expires: expireDate,
        secure: true,
        sameSite: "lax",
        path: "/",
      });
      return NextResponse.redirect(
        new URL("/two-factor-authentication", req.nextUrl)
      );
    }
    // Create session
    const session = await createSession(user.id);
    // Redirect Profile Page
    return NextResponse.json({ message: "Login Successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Something went wrong" },
      { status: 500 }
    );
  }
};
