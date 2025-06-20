import { jwtDecode } from "jwt-decode";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function getCookieValue(name: string) {
  return (
    document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop() || ""
  );
}

export function isJwtExpired(token: string) {
  try {
    const decoded = jwtDecode(token);

    const currentTime = Math.floor(Date.now() / 1000);
    const expirationTime = decoded.exp;

    return currentTime > expirationTime!;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return false;
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
