"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { LoginPayload, useSignupUser } from "../../api/auth";
import LoginSignupLayout from "../../layouts/LoginSignupLayout";
import { toast } from "sonner";

export default function SignupForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const { mutateAsync: singupUser } = useMutation({
    mutationFn: (data: LoginPayload) => useSignupUser(data),
  });

  async function handleSignup() {
    setIsLoading(true);
    try {
      await singupUser({
        username: username.trim(),
        password: password.trim(),
      });
      toast("Sign Up successful");
    } catch (error) {
      toast("Error");
    } finally {
      setUsername("");
      setPassword("");
      setIsLoading(false);
    }
  }

  return (
    <LoginSignupLayout
      heading="Sign Up"
      subHeading="Sign Up to start your quiz journey"
    >
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
          onClick={handleSignup}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Signing in...</span>
            </div>
          ) : (
            "Sign Up"
          )}
        </Button>
      </div>
    </LoginSignupLayout>
  );
}
