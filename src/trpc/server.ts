import "server-only";

import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { cache } from "react";
import { createCallerFactory } from "@/server/api/trpc";
import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import { makeQueryClient } from "./query-client";

const createContext = cache(async () => {
  const heads = new Headers(await headers());
  heads.set("x-trpc-source", "rsc");
  return createTRPCContext({
    req: new NextRequest("http://localhost", { headers: heads }),
  });
});

const getQueryClient = cache(makeQueryClient);

const caller = createCallerFactory(appRouter)(createContext);

export const { trpc: api, HydrateClient } = createHydrationHelpers<
  typeof appRouter
>(caller, getQueryClient);