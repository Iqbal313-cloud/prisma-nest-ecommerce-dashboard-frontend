import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

import {
  ac,
  superAdmin,
  admin,
  manager,
  sales,
  accountant,
  inventoryManager,
  viewer,
} from "./permissions";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",

  plugins: [
    adminClient({
      ac,
      roles: {
        superAdmin,
        admin,
        manager,
        sales,
        accountant,
        inventoryManager,
        viewer,
      },
    }),
  ],
});

export const { signIn, signUp, signOut, useSession } = authClient;
