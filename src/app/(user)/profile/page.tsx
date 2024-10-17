"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import TwoFactor from "@/components/twoFactor";

const Profile = () => {
  const [openTwoFactorDialog, setOpenTwoFactorDialog] =
    useState<boolean>(false);
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
          <p className="bg-gray-300 py-1 px-4 rounded-lg">{user?.fullname}</p>
        </div>
        <div className="flex justify-between items-center border-b pb-1">
          <p>Email</p>
          <p className="bg-gray-300 py-1 px-4 rounded-lg">{user?.email}</p>
        </div>
        <div className="flex justify-between items-center border-b pb-1">
          <p>Two Factor Authentication</p>
          <div>
            {user?.isTwoFaEnabled ? (
              <span className="px-2 py-1 bg-green-300 rounded-md mr-2">
                Yes
              </span>
            ) : (
              <span className="px-2 py-1 bg-red-300 rounded-md mr-2">No</span>
            )}
            <Button onClick={() => setOpenTwoFactorDialog(true)}>Edit</Button>
          </div>
        </div>
        {openTwoFactorDialog && <TwoFactor />}
      </CardContent>
    </Card>
  );
};

export default Profile;
