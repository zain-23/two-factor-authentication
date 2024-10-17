import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { email, fullname, password } = await req.json();

    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }
    // hash password
    const hashPassword = await bcrypt.hash(password, 10);
    // save user in db
    const user = await db.user.create({
      data: {
        email,
        password: hashPassword,
        fullname,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "Something went wrong when creating your account",
        },
        { status: 500 }
      );
    }
    // return response
    return NextResponse.json({ message: "Account Created" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Something went wrong" },
      { status: 500 }
    );
  }
};
