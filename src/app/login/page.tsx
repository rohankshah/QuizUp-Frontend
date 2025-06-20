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
    <div className="flex justify-center items-center h-full">
      <div className="space-y-4 flex flex-col max-w-sm w-96 mx-auto">
        <div className="w-full flex flex-col gap-2">
          <Label>Username</Label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <Label>Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button className="w-full" onClick={handleLogin} disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </div>
    </div>
  );
}
