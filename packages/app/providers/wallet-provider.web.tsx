import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { polygon, polygonMumbai, mainnet, goerli } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

const baseSepolia = {
  id: 84532,
  name: 'Base Sepolia',
  network: 'Base Sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Base Sepolia',
    symbol: 'ETH',
  },
  rpcUrls: {
    public: { http: ['https://base-sepolia.blockpi.network/v1/rpc/public'] },
    default: { http: ['https://base-sepolia.blockpi.network/v1/rpc/public'] },
  },
  blockExplorers: {
    etherscan: { name: 'BaseScan', url: 'https://sepolia.basescan.org/' },
    default: { name: 'BaseScan', url: 'https://sepolia.basescan.org/' },
  },
};

const { chains, provider, webSocketProvider } = configureChains(
  [baseSepolia],
  [
    publicProvider(),
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY }),
  ]
);
const { connectors } = getDefaultWallets({
  appName: "Onlyou",
  chains,
});

const wagmiClient = createClient({
  autoConnect: false,
  connectors,
  provider,
  webSocketProvider,
});

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>{children}</RainbowKitProvider>
    </WagmiConfig>
  );
};
