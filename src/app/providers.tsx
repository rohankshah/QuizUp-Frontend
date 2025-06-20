"use client";

import { ReactNode, useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { socketAtom } from "../atoms/atom";
import { connectSocket } from "../utils/socketConnect";
import { getCookieValue } from "../utils/utils";

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const setSocket = useSetAtom(socketAtom);

  useEffect(() => {
    const handleFocus = () => {
      const token = getCookieValue("token");

      if (token) {
        const socket = connectSocket(token);
        setSocket(socket);

        return () => {
          socket.disconnect();
        };
      }
    };

    handleFocus();

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        handleFocus();
      }
    });

    return () => {
      document.removeEventListener("visibilitychange", handleFocus);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
