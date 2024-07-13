import { StyleSheet } from "react-native";

import { PortalProvider } from "@gorhom/portal";

import { ScrollView } from "@showtime-xyz/universal.scroll-view";

import { LoginComponent } from "./login";
import { useLogin } from "./use-login";

interface LoginProps {
  onLogin?: () => void;
}

export function Login({ onLogin }: LoginProps) {
  //#region hooks
  const { handleSubmitWallet, loading } = useLogin(onLogin);

  //#endregion

  return (
    <PortalProvider>
      <ScrollView style={styles.container}>
        <LoginComponent
          handleSubmitWallet={handleSubmitWallet}
          loading={loading}
        />
      </ScrollView>
    </PortalProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  tabListItemContainer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    flex: 1,
    paddingTop: 16,
  },
});
