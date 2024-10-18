"use client";
import { generate2faQrCode } from "@/actions/generate-2fa-qrcode";
import Image from "next/image";
import { useEffect, useState } from "react";
import TwoFaForm from "./twoFaForm";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const TwoFactor = () => {
  const [qrcode, setQrcode] = useState<string>("");
  useEffect(() => {
    const twofaQrCode = async () => {
      const data = await generate2faQrCode();
      setQrcode(data.qrcode);
    };
    twofaQrCode();
  }, []);
  return (
    <div className="">
      <Card>
        <CardHeader>
          <CardTitle className="text-5xl">Authenticator app</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4 items-center">
          <div className="relative">
            <Image
              src={qrcode}
              alt="qrcode"
              width={250}
              height={250}
              className="rounded-md"
            />
          </div>
          <div>
            <p className="text-2xl font-bold mb-4">
              Use an Authenticator App to enable 2FA
            </p>
            <ul className="list-none list-inside mb-4">
              <li className="mb-2">
                <span className="font-bold">Step 1:</span> Scan the QR Code with
                your Authenticator app.
              </li>
              <li className="mb-2">
                <span className="font-bold">Step 2:</span> Enter the code below
                from your app to enable two factor authentication.
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
      <TwoFaForm apiUrl="/api/auth/enable-two-fa-authentication" />
    </div>
  );
};

export default TwoFactor;
