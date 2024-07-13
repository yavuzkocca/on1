import { Suspense } from "react";

import { Comments } from "app/components/comments";
import { CommentsStatus } from "app/components/comments/comments-status";
import { ErrorBoundary } from "app/components/error-boundary";
import { useNFTDetailByTokenId } from "app/hooks/use-nft-detail-by-token-id";
import { createParam } from "app/navigation/use-param";

type Query = {
  tokenId: string;
  contractAddress: string;
  chainName: string;
};

const { useParam } = createParam<Query>();

export function CommentsModal() {
  const [tokenId] = useParam("tokenId");
  const [contractAddress] = useParam("contractAddress");
  const [chainName] = useParam("chainName");
  const { data } = useNFTDetailByTokenId({
    chainName: chainName as string,
    tokenId: tokenId as string,
    contractAddress: contractAddress as string,
  });

  console.log(`BOKDATA ${JSON.stringify(data.data)}`);

  return (
    <ErrorBoundary>
      <Suspense
        fallback={<CommentsStatus isLoading={true} error={undefined} />}
      >
        {data?.data && <Comments nft={data?.data} />}
      </Suspense>
    </ErrorBoundary>
  );
}
