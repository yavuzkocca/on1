import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { Details } from "app/components/details";
import { useNFTDetailByTokenId } from "app/hooks/use-nft-detail-by-token-id";
import { useHideHeader } from "app/navigation/use-navigation-elements";
import { createParam } from "app/navigation/use-param";

type Query = {
  tokenId: string;
  contractAddress: string;
  chainName: string;
};

const { useParam } = createParam<Query>();

const DetailsModal = () => {
  useHideHeader();
  const [tokenId] = useParam("tokenId");
  const [contractAddress] = useParam("contractAddress");
  const [chainName] = useParam("chainName");

  const { data } = useNFTDetailByTokenId({
    chainName: chainName as string,
    tokenId: tokenId as string,
    contractAddress: contractAddress as string,
  });
  console.log(JSON.stringify(`DetailData=${data}`));
  return <Details nft={data} />;
};

export const DetailsScreen = withModalScreen(DetailsModal, {
  title: "Details",
  matchingPathname: "/nft/[chainName]/[contractAddress]/[tokenId]/details",
  matchingQueryParam: "detailsModal",
});
