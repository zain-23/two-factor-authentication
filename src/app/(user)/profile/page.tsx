"use client";
import { logoutUser } from "@/actions/logout";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Profile = () => {
  const router = useRouter();

  const [user, setUser] = useState<{
    email: string;
    fullname: string;
    isTwoFaEnabled: boolean;
  } | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const response = await fetch("/api/user");
      const user = await response.json();
      setUser(user.data);
    };
    getUser();
  }, []);
  return (
    <Card className="max-w-xl w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Profile Page</CardTitle>
        <CardDescription>
          Here user can manage and see their detail.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center border-b pb-1">
          <p>Fullname</p>
          <p className="bg-primary/60 py-1 px-4 rounded-lg">{user?.fullname}</p>
        </div>
        <div className="flex justify-between items-center border-b pb-1">
          <p>Email</p>
          <p className="bg-primary/60 py-1 px-4 rounded-lg">{user?.email}</p>
        </div>
        <div className="flex justify-between items-center border-b pb-1">
          <p>
            Two Factor Authentication{" "}
            <span
              className={cn(
                "text-xs px-2 py-1 rounded-md",
                user?.isTwoFaEnabled ? "bg-green-600" : "bg-red-600"
              )}
            >
              {user?.isTwoFaEnabled ? "Configured" : "Not Configured"}
            </span>
          </p>
          <div>
            {user?.isTwoFaEnabled ? (
              <Button>Disable</Button>
            ) : (
              <Link
                href={"/profile/enable-two-fa"}
                className={buttonVariants({
                  variant: "default",
                })}
              >
                Edit
              </Link>
            )}
          </div>
        </div>
        <Button
          variant={"destructive"}
          className="w-full"
          onClick={() => {
            logoutUser();
            router.refresh();
          }}
        >
          LogOut
        </Button>
      </CardContent>
    </Card>
  );
};

export default Profile;
