"use server";

import { logout } from "@/lib/session";

export const logoutUser = () => {
  logout();
};
