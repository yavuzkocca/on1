import useSWR from "swr";

import { axios } from "app/lib/axios";
import type { NFT } from "app/types";

type UseNFTDetailByTokenIdParams = {
  contractAddress?: string;
  tokenId?: string;
  chainName?: string;
};

type Data = {
  item: NFT;
};

export type NFTDetailPayload = {
  data: Data;
};

export const useNFTDetailByTokenId = (params: UseNFTDetailByTokenIdParams) => {
  const queryState = useSWR<NFTDetailPayload>(
    `/api/token/${params.contractAddress}/${params.tokenId}/${params.chainName}`,
    (url) =>
      axios({
        url,
        method: "GET",
      })
    // { suspense: true }
  );
  console.log(`QueryState=${JSON.stringify(queryState)}`);
  return queryState;
};
