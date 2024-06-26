"use client";
import React from "react";
import { ThemeProvider } from "next-themes";

import { WagmiProvider } from "wagmi";
import {
  darkTheme,
  getDefaultConfig,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { base, sepolia } from "viem/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SplitsClientProvider } from "./splitsClientProvider";
import { SplitsProvider } from "@0xsplits/splits-sdk-react";
import { PaymentSplitsProvider } from "./splitsProvider";

const queryClient = new QueryClient();
const config = getDefaultConfig({
  appName: "Armitage",
  projectId: "a9f78ae7bcb14f2dfcdcdb88bfca121c",
  chains: [sepolia, base],
  ssr: true,
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider
            theme={darkTheme({
              accentColor: "#84cc16",
              accentColorForeground: "black",
              borderRadius: "medium",
              fontStack: "system",
            })}
          >
            <SplitsProvider>
              <SplitsClientProvider>
                <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
                >
                  {children}
                </ThemeProvider>
              </SplitsClientProvider>
            </SplitsProvider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </>
  );
}
