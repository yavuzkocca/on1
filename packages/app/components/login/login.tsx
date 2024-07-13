import { StyleSheet } from "react-native";

import { View } from "@showtime-xyz/universal.view";

import { ConnectButton } from "app/components/connect-button";

import { LoginFooter } from "./login-footer";
import { LoginHeader } from "./login-header";
import { LoginOverlays } from "./login-overlays";
import type { SubmitWalletParams } from "./use-login";

interface LoginComponentProps {
  tw?: string;

  handleSubmitWallet: (
    params?: SubmitWalletParams | undefined
  ) => Promise<void>;
  loading: boolean;
}

export function LoginComponent({
  handleSubmitWallet,
  loading,
  tw = "",
}: LoginComponentProps) {
  return (
    <View tw={tw}>
      <View style={{ display: "flex" }}>
        <LoginHeader />
        <View style={styles.tabListItemContainer}>
          <ConnectButton handleSubmitWallet={handleSubmitWallet} />
          <LoginFooter tw="mt-4" />
        </View>
      </View>
      <LoginOverlays loading={loading} />
    </View>
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
