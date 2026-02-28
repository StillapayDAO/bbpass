import { createTRPCClient, httpBatchLink } from "@trpc/client";

// This is a placeholder - would need to import actual router type from your backend
export const trpc = createTRPCClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
    }),
  ],
}) as any; // Using 'any' as a temporary solution
