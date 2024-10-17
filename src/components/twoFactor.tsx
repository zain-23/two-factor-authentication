"use client";
import { generate2faQrCode } from "@/actions/generate-2fa-qrcode";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { z } from "zod";
import { CodeSchema } from "@/lib/form.schema";
import { zodResolver } from "@hookform/resolvers/zod";

const TwoFactor = () => {
  const [qrcode, setQrcode] = useState<string>("");
  const form = useForm<z.infer<typeof CodeSchema>>({
    resolver: zodResolver(CodeSchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = (data: z.infer<typeof CodeSchema>) => {
    console.log(data.code);
  };

  useEffect(() => {
    const twofaQrCode = async () => {
      const data = await generate2faQrCode();
      setQrcode(data.qrcode);
    };
    twofaQrCode();
  }, []);
  return (
    <div className="">
      <div className="flex gap-4 items-start">
        <Image src={qrcode} alt="qrcode" width={200} height={200} />
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
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter Code</FormLabel>
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormDescription>
                  Enter code from your authenticator app to enable{" "}
                  <span className="bg-gray-300 px-2 py-0.5 rounded-md">
                    Two-Factor Authentication.
                  </span>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="mt-2">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default TwoFactor;
