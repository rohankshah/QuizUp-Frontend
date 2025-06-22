"use client";

import React from "react";
import { Brain, ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import { useAtom } from "jotai";
import { userAtom } from "../atoms/atom";

export default function Home() {
  const [user] = useAtom(userAtom);

  return (
    <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-br from-pink-400/20 to-blue-500/20 rounded-full blur-xl"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center mt-[-3rem] min-h-screen px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl mb-6 shadow-2xl">
            <Brain className="w-10 h-10 text-white" />
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
              Clash Minds
            </h1>
            <p className="text-xl md:text-3xl text-gray-600 font-medium">
              Where Knowledge Meets Competition
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href={user ? "/quiz" : "/login"}
              className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 cursor-pointer text-white font-semibold rounded-2xl shadow-xl"
            >
              {user ? (
                <>
                  <Play className="w-5 h-5" />
                  <span>Play</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  <span>Login to Play</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
