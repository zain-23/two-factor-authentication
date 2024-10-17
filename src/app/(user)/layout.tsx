import React from "react";

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="h-screen w-full flex justify-center items-center">
      {children}
    </main>
  );
};

export default UserLayout;
