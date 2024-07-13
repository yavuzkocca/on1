import { useMemo } from "react";
import { StyleSheet } from "react-native";

import { PortalProvider } from "@gorhom/portal";

import { BottomSheetScrollView } from "app/components/bottom-sheet-scroll-view";

import { LoginComponent } from "./login";
import { useLogin } from "./use-login";

interface LoginProps {
  onLogin?: () => void;
}

export function Login({ onLogin }: LoginProps) {
  //#region hooks
  const {
    walletStatus,
    walletName,

    handleSubmitWallet,
    loading,
  } = useLogin(onLogin);

  //#endregion

  //#region variables
  const isConnectingToWallet = useMemo(
    () =>
      [
        "CONNECTING_TO_WALLET",
        "CONNECTED_TO_WALLET",
        "FETCHING_NONCE",
        "FETCHED_NONCE",
        "SIGNING_PERSONAL_MESSAGE",
      ].includes(walletStatus),
    [walletStatus]
  );

  //#endregion
  return (
    <PortalProvider>
      <BottomSheetScrollView style={styles.container}>
        <LoginComponent
          handleSubmitWallet={handleSubmitWallet}
          loading={loading && !isConnectingToWallet}
        />
      </BottomSheetScrollView>
    </PortalProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    minHeight: 400,
  },
  tabListItemContainer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    flex: 1,
    paddingTop: 16,
  },
});
