"use server";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import { decrypt, getCookie } from "@/lib/session";
import { db } from "@/lib/db";

export const generate2faQrCode = async () => {
  const session = getCookie();
  const payload = await decrypt(session);

  // check user already have secret ? create qr code and return
  const user = await db.user.findUnique({
    where: {
      id: payload?.payload.userId as string,
    },
    select: {
      twoFaSecret: true,
      id: true,
      fullname: true,
    },
  });

  if (!user?.twoFaSecret) {
    // create secret
    const secret = speakeasy.generateSecret({
      name: "ZA 2Fa Authentication",
      length: 20,
    });
    // save secret into db
    await db.user.update({
      where: {
        id: user?.id,
      },
      data: {
        twoFaSecret: secret.base32,
      },
    });
    // create qrcode
    const data = await QRCode.toDataURL(secret.otpauth_url!);
    // send qrcode
    return {
      qrcode: data,
      message: "Two Factor code generated",
    };
  }
  const data = await QRCode.toDataURL(
    `otpauth://totp/ZA%202Fa%20Authentication?secret=${user.twoFaSecret}`
  );

  return {
    qrcode: data,
    message: "Two Factor code generated",
  };
};
