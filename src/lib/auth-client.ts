import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

import { ac, admin, manager, sales } from "./permissions";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",

  plugins: [
    adminClient({
      ac,
      roles: {
        admin,
        manager,
        sales,
      },
    }),
  ],
});

export const { signIn, signUp, signOut, useSession } = authClient;
