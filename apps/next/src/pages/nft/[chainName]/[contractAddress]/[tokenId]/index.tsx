import axios from "axios";

import { NftScreen } from "app/screens/nft";
import type { NFT } from "app/types";
import { getMediaUrl } from "app/utilities";

export async function getServerSideProps(context) {
  const { chainName, contractAddress, tokenId } = context.params;
  console.log(`chainName${chainName}`);
  console.log(`chainName${contractAddress}`);
  console.log(`chainName${tokenId}`);
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/token/${contractAddress}/${tokenId}/${chainName}`
    );

    const fallback = {
      [`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/token/${contractAddress}/${tokenId}/${chainName}`]:
        res?.data,
    };

    const nft = res.data as NFT;

    console.log(`TKENIDNFT=${JSON.stringify(res.data)}`);
    const imageUrl = getMediaUrl({
      nft,
      stillPreview: nft?.mime_type?.startsWith("video"),
    });
    //EKEK NFT TOKEN NAME
    if (nft) {
      return {
        props: {
          fallback,
          meta: {
            title: nft?.token_name,
            description: nft.token_description,
            image: imageUrl,
            deeplinkUrl: `nft/${chainName}/${contractAddress}/${tokenId}`,
          },
        },
      };
    }
  } catch (e) {
    console.error(e);
  }

  return {
    props: {},
  };
}

export default NftScreen;
