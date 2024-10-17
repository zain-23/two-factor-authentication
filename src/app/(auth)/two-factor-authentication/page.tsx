import { db } from "@/lib/db";
import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import React from "react";

const TwoFactorAuthentication = async () => {
  const session = await cookies().get("2fa_challenge")?.value;
  if (!session) notFound();

  const payload = await decrypt(session);
  if (!payload?.payload.userId) notFound();

  const user = await db.user.findUnique({
    where: {
      id: payload.payload.userId as string,
    },
    select: {
      email: true,
    },
  });
  return <div>TwoFactorAuthentication</div>;
};

export default TwoFactorAuthentication;
