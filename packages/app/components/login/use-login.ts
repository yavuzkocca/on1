import { useCallback, useEffect, useRef } from "react";
import { Platform } from "react-native";

import { captureException } from "@sentry/nextjs";

import { useAuth } from "app/hooks/auth/use-auth";
import { useWalletLogin } from "app/hooks/auth/use-wallet-login";
import { useStableBlurEffect } from "app/hooks/use-stable-blur-effect";

type LoginSource = "undetermined" | "magic" | "wallet";

export type SubmitWalletParams = {
  onOpenConnectModal?: () => void;
};
export const useLogin = (onLogin?: () => void) => {
  const loginSource = useRef<LoginSource>("undetermined");

  //#region hooks
  const { authenticationStatus, logout } = useAuth();
  const {
    loginWithWallet,
    name: walletName,
    status: walletStatus,
    error: walletError,
    //@ts-ignore web only
    showSignMessage,
    //@ts-ignore web only
    verifySignature,
  } = useWalletLogin();
  const isWeb = Platform.OS === "web";
  //#endregion

  //#region methods
  const handleLoginFailure = useCallback(function handleLoginFailure(
    error: any
  ) {
    loginSource.current = "undetermined";

    if (process.env.NODE_ENV === "development" || __DEV__) {
      console.error(error);
    }
    captureException(error, {
      tags: {
        login_signature_flow: "use-login.ts",
        login_magic_link: "use-login.ts",
      },
    });
  },
  []);

  const handleSubmitWallet = useCallback(
    async function handleSubmitWallet(params?: SubmitWalletParams) {
      try {
        if (isWeb) {
          console.log(loginSource.current);

          params?.onOpenConnectModal?.();
          console.log(`USELOGIN ${JSON.stringify(params)}`);
        } else {
          await loginWithWallet();
        }
      } catch (error) {
        handleLoginFailure(error);
      }
    },
    [isWeb, loginWithWallet, handleLoginFailure]
  );

  /**
   * We make sure to prevent/stop the authentication state,
   * when customer closes the login modal.
   */
  const handleBlur = useCallback(() => {
    // @ts-ignore
    loginSource.current = undefined;

    if (authenticationStatus === "AUTHENTICATING") {
      logout();
    }
  }, [logout, authenticationStatus]);
  //#endregion

  //#region effects
  useStableBlurEffect(handleBlur);
  useEffect(() => {
    const isLoggedInByWallet =
      loginSource.current === "wallet" && walletStatus === "EXPIRED_NONCE";

    if (isLoggedInByWallet && onLogin) {
      onLogin();
    }
  }, [authenticationStatus, walletStatus, onLogin]);

  useEffect(() => {
    if (walletStatus === "ERRORED" && walletError) {
      handleLoginFailure(walletError);
    }
  }, [handleLoginFailure, walletStatus, walletError]);
  //#endregion

  return {
    authenticationStatus,
    loading: authenticationStatus === "AUTHENTICATING",
    walletName,
    walletStatus,
    handleSubmitWallet,
    showSignMessage,
    verifySignature,
  };
};
