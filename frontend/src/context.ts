import { createContext } from "react";
import { UserData } from "./hooks/useToolkitGateway";

export const GlobalContext = createContext<{
  signOut: Function;
  user: UserData | null;
}>({
  signOut: () => {},
  user: null,
});
