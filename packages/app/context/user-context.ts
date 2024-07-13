import { createContext } from "react";

import type { KeyedMutator } from "swr";

import type { MyInfo, Profile } from "../types";

type UserContextType = {
  user?: MyInfo;
  error?: Error;
  isLoading: boolean;
  isAuthenticated: boolean;
  mutate: KeyedMutator<Profile>;
  isIncompletedProfile: boolean | undefined;
};

export const UserContext = createContext<UserContextType | null>(null);
