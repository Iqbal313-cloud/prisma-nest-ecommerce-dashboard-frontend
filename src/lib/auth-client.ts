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
  baseURL: "https://prisma-nest-ecommerce-api.onrender.com",
  fetchOptions: {
    credentials: "include",
  },

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

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  requestPasswordReset,
  resetPassword,
} = authClient;
