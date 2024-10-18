import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import TwoVerificationForm from "./twoVerificationForm";

const TwoFactorAuthentication = async () => {
  const session = await cookies().get("2fa_challenge")?.value;
  if (!session) notFound();

  const payload = await decrypt(session);
  if (!payload?.payload.userId) notFound();

  return (
    <Card className="max-w-lg w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">2 Factor Authentication</CardTitle>
        <CardDescription>Add security layer</CardDescription>
      </CardHeader>
      <CardContent>
        <TwoVerificationForm />
      </CardContent>
    </Card>
  );
};

export default TwoFactorAuthentication;
