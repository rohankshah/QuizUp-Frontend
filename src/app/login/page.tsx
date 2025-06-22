"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { connectSocket } from "../../utils/socketConnect";
import { socketAtom, userAtom } from "../../atoms/atom";
import { useRouter } from "next/navigation";
import { LoginPayload, useLoginUser } from "../../api/auth";

import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export default function LoginForm() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const setSocket = useSetAtom(socketAtom);
  const setUser = useSetAtom(userAtom);

  const { mutateAsync: loginUser } = useMutation({
    mutationFn: (data: LoginPayload) => useLoginUser(data),
  });

  async function handleLogin() {
    setIsLoading(true);
    try {
      const data = await loginUser({ username, password });
      const token = data.token;

      if (!token) throw new Error("No token received");

      Cookies.set("token", token, {
        path: "/",
        secure: true,
        sameSite: "strict",
        expires: 1 / 24,
      });

      const user = jwtDecode(token);
      setUser(user);

      const socket = connectSocket(token);
      setSocket(socket);

      router.push("/quiz");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex justify-center items-center h-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 space-y-6">
          <div className="text-center space-y-3 mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="text-gray-500">Login to start your quiz journey</p>
            <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto"></div>
          </div>

          <div className="space-y-5">
            <div className="w-full flex flex-col gap-3">
              <Label className="text-gray-700 font-semibold">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-12 px-4 rounded-xl border-2 border-gray-20 bg-white/50 backdrop-blur-sm"
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="w-full flex flex-col gap-3">
              <Label className="text-gray-700 font-semibold">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 px-4 rounded-xl border-2 border-gray-200 bg-white/50 backdrop-blur-sm"
                placeholder="Enter your password"
                required
              />
            </div>
            <Button
              className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Logging in...</span>
                </div>
              ) : (
                "Login"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
