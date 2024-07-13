import { useEffect, useMemo, ReactNode, useRef } from "react";
import { Platform } from "react-native";

import useSWR from "swr";

import { useRouter } from "@showtime-xyz/universal.router";

import { UserContext } from "app/context/user-context";
import { useAuth } from "app/hooks/auth/use-auth";
import { axios } from "app/lib/axios";
import { registerForPushNotificationsAsync } from "app/lib/register-push-notification";
import { isProfileIncomplete } from "app/utilities";

interface UserProviderProps {
  children: ReactNode;
}

export const MY_INFO_ENDPOINT = "/api/users/myinfo";

export function UserProvider({ children }: UserProviderProps) {
  //#region hooks
  //const { rudder } = useRudder();
  const { authenticationStatus, accessToken } = useAuth();
  const router = useRouter();
  const walletAddress = localStorage.getItem("wallet");
  const { data, error, mutate } = useSWR(
    accessToken ? `/api/users/myinfo?wallet=${walletAddress}` : null,
    (url) => axios({ url, method: "GET" })
  );
  console.log(`DATEAAA =${JSON.stringify(data)}`);
  //#endregion
  //#region refs
  const isFirstLoad = useRef(true);
  //#endregion
  //#region variables
  const isLoading =
    authenticationStatus === "IDLE" ||
    authenticationStatus === "REFRESHING" ||
    (authenticationStatus === "AUTHENTICATED" && !error && !data);

  console.log(`USErProviderData=${JSON.stringify(data?.data.data)}`);

  const isIncompletedProfile = isProfileIncomplete(data?.data?.data?.profile);
  console.log(`USERPROV ${isIncompletedProfile} `);

  const userContextValue = useMemo(
    () => ({
      user: data,
      mutate,
      error,
      isLoading,
      isAuthenticated: accessToken != undefined,
      isIncompletedProfile,
    }),
    [data, mutate, error, isLoading, accessToken, isIncompletedProfile]
  );
  //#endregion

  //#region effects
  useEffect(() => {
    if (
      authenticationStatus === "AUTHENTICATED" ||
      authenticationStatus === "UNAUTHENTICATED"
    ) {
      mutate();
    }

    if (authenticationStatus === "UNAUTHENTICATED") {
      isFirstLoad.current = true;
    }
  }, [authenticationStatus, mutate, router]);

  useEffect(() => {
    const identifyAndRegisterPushNotification = async () => {
      if (data) {
        // Handle registration for push notification
        if (Platform.OS !== "web") {
          await registerForPushNotificationsAsync();
        }
      }
    };

    identifyAndRegisterPushNotification();
  }, [data]);
  //#endregion

  useEffect(() => {
    if (data) {
      //Kullanıcı giriş yaptıktan sonra ve kullanıcı durumu yüklendikten sonra çalışır
      if (isIncompletedProfile && router.pathname !== "/profile/edit") {
        //Profili tamamlanmamışsa ve kullanıcı profil düzenleme sayfasında değilse
        router.push("/profile/edit"); // Profil düzenleme sayfasına yönlendir
      }
    }
  }, [data, isIncompletedProfile, router]);

  return (
    <UserContext.Provider value={userContextValue}>
      {children}
    </UserContext.Provider>
  );
}
