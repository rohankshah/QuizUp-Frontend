"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";

import Cookies from "js-cookie";
import { useAtom, useSetAtom } from "jotai";
import { userAtom } from "../../atoms/atom";
import { useEffect } from "react";
import { getCookieValue, isJwtExpired } from "../../utils/utils";
import { jwtDecode } from "jwt-decode";

const Navbar = () => {

  const [user] = useAtom(userAtom);
  const setUser = useSetAtom(userAtom);

  const handleLogout = () => {
    Cookies.remove("token", { path: "/" });
    window.location.href = "/";
  };

  useEffect(() => {
    const token = getCookieValue("token");

    if (token) {
      const user = jwtDecode(token);
      if (token && !isJwtExpired(token)) {
        setUser(user);
      } else {
        setUser(user);
      }
    }
  }, []);

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">
          <Link href="/">ClashMind</Link>
        </div>
        <div className="space-x-8 flex items-center">
          <Link href="/" className="hover:text-gray-200 cursor-pointer">
            Home
          </Link>
          {!user ? (
            <Link href="/login" className="hover:text-gray-200 cursor-pointer">
              Login
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="hover:text-gray-200 cursor-pointer"
            >
              <LogOut />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
