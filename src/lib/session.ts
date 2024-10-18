"server only";
import { JWTPayload, jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: JWTPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined) {
  try {
    if (!session) {
      return null;
    }
    const payload = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.log("ERROR WHEN DESCRYPTING SESSION", error);
  }
}

export async function createSession(userId: string) {
  const expireDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ userId });
  await cookies().set("session", session, {
    httpOnly: true,
    expires: expireDate,
    secure: true,
    sameSite: "lax",
    path: "/",
  });
}

export const getCookie = () => {
  const session = cookies().get("session")?.value!;
  return session;
};

export const logout = async () => {
  cookies().delete("session");
};
