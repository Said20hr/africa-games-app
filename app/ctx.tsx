// context/AuthContext.tsx
import { queryClient } from "@/api/query-client";
import { REMEMBER_ME, USER_TOKEN } from "@/constants/Keys";
import { ILoginResponse } from "@/shared/type/User.type";
import { storage } from "@/shared/util/mmkv";
import { StackActions } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigation } from "expo-router";
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
  updateCheckIn: (newTime: string) => void;
  updateCheckOut: (newTime: string) => void;
  session?: ILoginResponse | null;
  isLoading: boolean;
};

const AuthContext = createContext<IAuthContext>({
  signIn: () => null,
  signOut: () => null,
  updateCheckIn: (newTime: string) => null,
  updateCheckOut: (newTime: string) => null,
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
  const [session, setSession] = useState<ILoginResponse | null | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const {
    data,
    error,
    isLoading: dataLoading,
  } = useQuery({
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
        // console.log(response.data.data.check_in);
        // console.log(response.data.data.check_out);
        return response.data;
      } catch (error) {}
    },
  });

  useEffect(() => {
    if (!isLoading) {
      if (data) {
        signIn(data.data);
      } else {
        signOut();
      }
    }
  }, [isLoading]);

  useEffect(() => {
    if (!dataLoading) setIsLoading(false);
  }, [data, error]);

  const signIn = (data: ILoginResponse) => {
    setSession(data);
  };

  const signOut = () => {
    setSession(null);
    storage.setItem(USER_TOKEN, "");
    queryClient.clear();
    // navigation.dispatch(StackActions.replace("(auth)/guest"));
  };

  const updateCheckIn = (newTime: string) => {
    if (!session) return;
    const newSessionData: ILoginResponse = {
      ...session,
      check_in: newTime,
    };
    setSession(newSessionData);
  };

  const updateCheckOut = (newTime: string) => {
    if (!session) return;
    const newSessionData: ILoginResponse = {
      ...session,
      check_out: newTime,
    };
    setSession(newSessionData);
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        session,
        isLoading,
        updateCheckIn,
        updateCheckOut,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
