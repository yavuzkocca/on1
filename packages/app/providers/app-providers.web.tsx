import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { ThirdwebProvider, ChainId } from "@thirdweb-dev/react";
import { createClient, Provider } from "urql";

import { AlertProvider } from "@showtime-xyz/universal.alert";
import { ColorSchemeProvider } from "@showtime-xyz/universal.color-scheme";
import { LightBoxProvider } from "@showtime-xyz/universal.light-box";
import { SafeAreaProvider } from "@showtime-xyz/universal.safe-area";
import { SnackbarProvider } from "@showtime-xyz/universal.snackbar";
import { ToastProvider } from "@showtime-xyz/universal.toast";

import { NavigationProvider } from "app/navigation";
import { AuthProvider } from "app/providers/auth-provider";
import { ClaimProvider } from "app/providers/claim-provider";
import { FeedProvider } from "app/providers/feed-provider";
import { MuteProvider } from "app/providers/mute-provider";
import { UserProvider } from "app/providers/user-provider";
import { WalletProvider } from "app/providers/wallet-provider";
import { Web3Provider } from "app/providers/web3-provider";

const activeChainId = ChainId.ArbitrumGoerli;

const APIURL = "https://api.studio.thegraph.com/query/42974/onlyshow/v0.0.4";

const client = createClient({
  url: APIURL,
});

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider value={client}>
      <ColorSchemeProvider>
        <SafeAreaProvider>
          <ToastProvider>
            <LightBoxProvider>
              <ThirdwebProvider
                activeChain={activeChainId}
                clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
              >
                <WalletProvider>
                  <AlertProvider>
                    <SnackbarProvider>
                      <Web3Provider>
                        <AuthProvider>
                          <UserProvider>
                            <BottomSheetModalProvider>
                              <FeedProvider>
                                <NavigationProvider>
                                  <MuteProvider>
                                    <ClaimProvider>{children}</ClaimProvider>
                                  </MuteProvider>
                                </NavigationProvider>
                              </FeedProvider>
                            </BottomSheetModalProvider>
                          </UserProvider>
                        </AuthProvider>
                      </Web3Provider>
                    </SnackbarProvider>
                  </AlertProvider>
                </WalletProvider>
              </ThirdwebProvider>
            </LightBoxProvider>
          </ToastProvider>
        </SafeAreaProvider>
      </ColorSchemeProvider>
    </Provider>
  );
};
