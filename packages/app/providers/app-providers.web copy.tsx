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
import { BiconomyProvider } from "app/providers/biconomy-provider";
import { ClaimProvider } from "app/providers/claim-provider";
import { FeedProvider } from "app/providers/feed-provider";
import { MuteProvider } from "app/providers/mute-provider";
import { UserProvider } from "app/providers/user-provider";
import { WalletProvider } from "app/providers/wallet-provider";
import { Web3Provider } from "app/providers/web3-provider";

const activeChainId = ChainId.Mumbai;

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
                clientId="28b7befea2923a50b9fd9f7e03f2671e"
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
                                  <BiconomyProvider>
                                    <MuteProvider>
                                      <ClaimProvider>{children}</ClaimProvider>
                                    </MuteProvider>
                                  </BiconomyProvider>
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
