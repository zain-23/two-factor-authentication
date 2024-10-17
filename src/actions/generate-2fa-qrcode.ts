"use server";
import speakeasy from "speakeasy";
import QRCode from "qrcode";

export const generate2faQrCode = async () => {
  // create secret
  const secret = speakeasy.generateSecret({
    name: "Zain Ali",
  });
  // create qrcode
  const data = await QRCode.toDataURL(secret.otpauth_url!);
  // send qrcode
  return {
    qrcode: data,
    secret: secret.base32,
    message: "Two Factor code generated",
  };
};
