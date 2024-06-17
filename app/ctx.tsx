// context/AuthContext.tsx
import { REMEMBER_ME, USER_TOKEN } from "@/constants/Keys";
import { ILoginResponse } from "@/shared/type/User.type";
import { storage } from "@/shared/util/mmkv";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { Alert } from "react-native";

export type IAuthContext = {
  signIn: (data: ILoginResponse) => void;
  signOut: () => void;
  session?: ILoginResponse | null;
  isLoading: boolean;
};

const AuthContext = createContext<IAuthContext>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: true,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export function SessionProvider(props: { children: ReactNode }) {
  const [session, setSession] = useState<ILoginResponse | null>(null);
  const { data, error, isLoading } = useQuery({
    queryKey: ["refetchData"],
    queryFn: async () => {
      try {
        const token = storage.getItem(USER_TOKEN);
        const rememberMe = storage.getBoolean(REMEMBER_ME);
        if (!token || token === "" || !rememberMe) return null;

        const response = await axios.get(
          `https://africa-games-app.online/api/refresh-daily-data`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data;
      } catch (error) {}
    },
  });

  useEffect(() => {
    if (!isLoading) {
      if (data) {
        setSession(data.data);
        console.log(data.data);
      } else if (error) {
        console.log(error);
        // signOut()
      }
    }
  }, [data, error]);

  const signIn = (data: ILoginResponse) => {
    setSession(data);
  };

  const signOut = () => {
    setSession(null);
    storage.setItem(USER_TOKEN, "");
  };

  return (
    <AuthContext.Provider value={{ signIn, signOut, session, isLoading }}>
      {props.children}
    </AuthContext.Provider>
  );
}
