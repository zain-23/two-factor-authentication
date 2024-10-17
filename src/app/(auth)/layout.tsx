import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="h-screen w-full flex justify-center items-center">
      {children}
    </main>
  );
};

export default AuthLayout;
