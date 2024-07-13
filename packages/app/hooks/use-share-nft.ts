import { Linking } from "react-native";

import { ethers } from "ethers";

import { useShare } from "app/hooks/use-share";
import { NFT } from "app/types";
import { getTwitterIntent } from "app/utilities";

export const getNFTSlug = (nft: NFT) =>
  `/nft/${nft.chain_name}/${nft?.contract_address}/${nft?.token_id}`;

export const getNFTURL = (nft: NFT | undefined) => {
  if (!nft) {
    return "";
  }
  return `https://${process.env.NEXT_PUBLIC_WEBSITE_DOMAIN + getNFTSlug(nft)}`;
};

export const useShareNFT = () => {
  //const { rudder } = useRudder();
  const share = useShare();

  const shareNFT = async (nft?: NFT) => {
    if (!nft) return;
    const url = getNFTURL(nft);
    const result = await share({
      url,
    });
  };
  const shareNFTOnTwitter = async (nft?: NFT) => {
    if (!nft) return;
    const url = `https://${process.env.NEXT_PUBLIC_WEBSITE_DOMAIN}/nft/${nft.chain_name}/${nft?.contract_address}/${nft?.token_id}`;
    // Todo: add share Claim/Drop copytext
    Linking.openURL(
      getTwitterIntent({
        url,
        message: ``,
      })
    );
  };

  // const showPrivImage = async (nft?: NFT) => {
  //   if (!nft) return;

  //   const ABI
  //   const Contract_Address = nft.nft_id;
  //   const provider = new ethers.providers.Web3Provider(window.ethereum);
  //   let EditionContract;
  //   provider.send("eth_requestAccounts", []).then(() => {
  //     provider.listAccounts().then((accounts) => {
  //       const signer = provider.getSigner(accounts[0]);

  //       /* 3.1 Create instance of pet smart contract */
  //       EditionContract = new ethers.Contract(Contract_Address, ABI, signer);
  //       console.log(EditionContract);
  //     });
  //   });
  //   console.log(EditionContract);
  //   const showImage = await EditionContract.getURIs();
  //   console.log(showImage);
  //   return showImage;

  //   /* 3.1 Create instance of pet smart contract */
  //   // const onPress = async () => {
  //   //   const showImage = await EditionContract.getPrivateURI(0);
  //   //   console.log(showImage);
  //   //   return showImage;
  //   // };
  //   // onPress();
  // };

  // const showPrivImage = async (nft?: NFT) => {
  //   if (!nft) return;

  //   const ABI = [
  //     {
  //       inputs: [
  //         {
  //           internalType: "contract SharedNFTLogic",
  //           name: "_sharedNFTLogic",
  //           type: "address",
  //         },
  //       ],
  //       stateMutability: "nonpayable",
  //       type: "constructor",
  //     },
  //     {
  //       inputs: [],
  //       name: "TimeLimitReached",
  //       type: "error",
  //     },
  //     {
  //       anonymous: false,
  //       inputs: [
  //         {
  //           indexed: true,
  //           internalType: "address",
  //           name: "owner",
  //           type: "address",
  //         },
  //         {
  //           indexed: true,
  //           internalType: "address",
  //           name: "approved",
  //           type: "address",
  //         },
  //         {
  //           indexed: true,
  //           internalType: "uint256",
  //           name: "tokenId",
  //           type: "uint256",
  //         },
  //       ],
  //       name: "Approval",
  //       type: "event",
  //     },
  //     {
  //       anonymous: false,
  //       inputs: [
  //         {
  //           indexed: true,
  //           internalType: "address",
  //           name: "owner",
  //           type: "address",
  //         },
  //         {
  //           indexed: true,
  //           internalType: "address",
  //           name: "operator",
  //           type: "address",
  //         },
  //         {
  //           indexed: false,
  //           internalType: "bool",
  //           name: "approved",
  //           type: "bool",
  //         },
  //       ],
  //       name: "ApprovalForAll",
  //       type: "event",
  //     },
  //     {
  //       anonymous: false,
  //       inputs: [
  //         {
  //           indexed: false,
  //           internalType: "uint256",
  //           name: "price",
  //           type: "uint256",
  //         },
  //         {
  //           indexed: false,
  //           internalType: "address",
  //           name: "owner",
  //           type: "address",
  //         },
  //       ],
  //       name: "EditionSold",
  //       type: "event",
  //     },
  //     {
  //       anonymous: false,
  //       inputs: [
  //         {
  //           indexed: false,
  //           internalType: "uint8",
  //           name: "version",
  //           type: "uint8",
  //         },
  //       ],
  //       name: "Initialized",
  //       type: "event",
  //     },
  //     {
  //       anonymous: false,
  //       inputs: [
  //         {
  //           indexed: true,
  //           internalType: "address",
  //           name: "previousOwner",
  //           type: "address",
  //         },
  //         {
  //           indexed: true,
  //           internalType: "address",
  //           name: "newOwner",
  //           type: "address",
  //         },
  //       ],
  //       name: "OwnershipTransferred",
  //       type: "event",
  //     },
  //     {
  //       anonymous: false,
  //       inputs: [
  //         {
  //           indexed: false,
  //           internalType: "uint256",
  //           name: "amount",
  //           type: "uint256",
  //         },
  //       ],
  //       name: "PriceChanged",
  //       type: "event",
  //     },
  //     {
  //       anonymous: false,
  //       inputs: [
  //         {
  //           indexed: true,
  //           internalType: "address",
  //           name: "from",
  //           type: "address",
  //         },
  //         {
  //           indexed: true,
  //           internalType: "address",
  //           name: "to",
  //           type: "address",
  //         },
  //         {
  //           indexed: true,
  //           internalType: "uint256",
  //           name: "tokenId",
  //           type: "uint256",
  //         },
  //       ],
  //       name: "Transfer",
  //       type: "event",
  //     },
  //     {
  //       inputs: [
  //         {
  //           internalType: "address",
  //           name: "to",
  //           type: "address",
  //         },
  //         {
  //           internalType: "uint256",
  //           name: "tokenId",
  //           type: "uint256",
  //         },
  //       ],
  //       name: "approve",
  //       outputs: [],
  //       stateMutability: "nonpayable",
  //       type: "function",
  //     },
  //     {
  //       inputs: [
  //         {
  //           internalType: "address",
  //           name: "owner",
  //           type: "address",
  //         },
  //       ],
  //       name: "balanceOf",
  //       outputs: [
  //         {
  //           internalType: "uint256",
  //           name: "",
  //           type: "uint256",
  //         },
  //       ],
  //       stateMutability: "view",
  //       type: "function",
  //     },
  //     {
  //       inputs: [
  //         {
  //           internalType: "uint256",
  //           name: "tokenId",
  //           type: "uint256",
  //         },
  //       ],
  //       name: "burn",
  //       outputs: [],
  //       stateMutability: "nonpayable",
  //       type: "function",
  //     },
  //     {
  //       inputs: [],
  //       name: "contentType",
  //       outputs: [
  //         {
  //           internalType: "string",
  //           name: "",
  //           type: "string",
  //         },
  //       ],
  //       stateMutability: "view",
  //       type: "function",
  //     },
  //     {
  //       inputs: [],
  //       name: "description",
  //       outputs: [
  //         {
  //           internalType: "string",
  //           name: "",
  //           type: "string",
  //         },
  //       ],
  //       stateMutability: "view",
  //       type: "function",
  //     },
  //     {
  //       inputs: [],
  //       name: "editionSize",
  //       outputs: [
  //         {
  //           internalType: "uint256",
  //           name: "",
  //           type: "uint256",
  //         },
  //       ],
  //       stateMutability: "view",
  //       type: "function",
  //     },
  //     {
  //       inputs: [
  //         {
  //           internalType: "uint256",
  //           name: "tokenId",
  //           type: "uint256",
  //         },
  //       ],
  //       name: "getApproved",
  //       outputs: [
  //         {
  //           internalType: "address",
  //           name: "",
  //           type: "address",
  //         },
  //       ],
  //       stateMutability: "view",
  //       type: "function",
  //     },
  //     {
  //       inputs: [],
  //       name: "getContentType",
  //       outputs: [
  //         {
  //           internalType: "string",
  //           name: "",
  //           type: "string",
  //         },
  //       ],
  //       stateMutability: "view",
  //       type: "function",
  //     },
  //     {
  //       inputs: [],
  //       name: "getCreatorName",
  //       outputs: [
  //         {
  //           internalType: "string",
  //           name: "",
  //           type: "string",
  //         },
  //       ],
  //       stateMutability: "view",
  //       type: "function",
  //     },
  //     {
  //       inputs: [],
  //       name: "getEndOfMintPeriod",
  //       outputs: [
  //         {
  //           internalType: "uint64",
  //           name: "",
  //           type: "uint64",
  //         },
  //       ],
  //       stateMutability: "view",
  //       type: "function",
  //     },
  //     {
  //       inputs: [
  //         {
  //           internalType: "uint256",
  //           name: "tokenId",
  //           type: "uint256",
  //         },
  //       ],
  //       name: "getPrivateURI",
  //       outputs: [
  //         {
  //           internalType: "string",
  //           name: "",
  //           type: "string",
  //         },
  //       ],
  //       stateMutability: "view",
  //       type: "function",
  //     },
  //     {
  //       inputs: [],
  //       name: "getURIs",
  //       outputs: [
  //         {
  //           internalType: "string",
  //           name: "",
  //           type: "string",
  //         },
  //       ],
  //       stateMutability: "view",
  //       type: "function",
  //     },
  //     {
  //       inputs: [
  //         {
  //           internalType: "address",
  //           name: "_owner",
  //           type: "address",
  //         },
  //         {
  //           internalType: "string",
  //           name: "_name",
  //           type: "string",
  //         },
  //         {
  //           internalType: "string",
  //           name: "_symbol",
  //           type: "string",
  //         },
  //         {
  //           internalType: "string",
  //           name: "_description",
  //           type: "string",
  //         },
  //         {
  //           internalType: "string",
  //           name: "_imageUrl",
  //           type: "string",
  //         },
  //         {
  //           internalType: "string",
  //           name: "_contentType",
  //           type: "string",
  //         },
  //         {
  //           internalType: "uint256",
  //           name: "_editionSize",
  //           type: "uint256",
  //         },
  //         {
  //           internalType: "uint256",
  //           name: "_royaltyBPS",
  //           type: "uint256",
  //         },
  //         {
  //           internalType: "uint256",
  //           name: "_mintPeriodSeconds",
  //           type: "uint256",
  //         },
  //         {
  //           internalType: "uint256",
  //           name: "_salePrice",
  //           type: "uint256",
  //         },
  //         {
  //           internalType: "string",
  //           name: "_creatorName",
  //           type: "string",
  //         },
  //         {
  //           internalType: "string",
  //           name: "_privateImage",
  //           type: "string",
  //         },
  //       ],
  //       name: "initialize",
  //       outputs: [],
  //       stateMutability: "nonpayable",
  //       type: "function",
  //     },
  //     {
  //       inputs: [
  //         {
  //           internalType: "address",
  //           name: "owner",
  //           type: "address",
  //         },
  //         {
  //           internalType: "address",
  //           name: "operator",
  //           type: "address",
  //         },
  //       ],
  //       name: "isApprovedForAll",
  //       outputs: [
  //         {
  //           internalType: "bool",
  //           name: "",
  //           type: "bool",
  //         },
  //       ],
  //       stateMutability: "view",
  //       type: "function",
  //     },
  //     {
  //       inputs: [
  //         {
  //           internalType: "address",
  //           name: "to",
  //           type: "address",
  //         },
  //       ],
  //       name: "mintEdition",
  //       outputs: [
  //         {
  //           internalType: "uint256",
  //           name: "",
  //           type: "uint256",
  //         },
  //       ],
  //       stateMutability: "nonpayable",
  //       type: "function",
  //     },
  //     {
  //       inputs: [
  //         {
  //           internalType: "address[]",
  //           name: "recipients",
  //           type: "address[]",
  //         },
  //       ],
  //       name: "mintEditions",
  //       outputs: [
  //         {
  //           internalType: "uint256",
  //           name: "",
  //           type: "uint256",
  //         },
  //       ],
  //       stateMutability: "nonpayable",
  //       type: "function",
  //     },
  //     {
  //       inputs: [],
  //       name: "name",
  //       outputs: [
  //         {
  //           internalType: "string",
  //           name: "",
  //           type: "string",
  //         },
  //       ],
  //       stateMutability: "view",
  //       type: "function",
  //     },
  //     {
  //       inputs: [],
  //       name: "numberCanMint",
  //       outputs: [
  //         {
  //           internalType: "uint256",
  //           name: "",
  //           type: "uint256",
  //         },
  //       ],
  //       stateMutability: "view",
  //       type: "function",
  //     },
  //     {
  //       inputs: [],
  //       name: "owner",
  //       outputs: [
  //         {
  //           internalType: "address",
  //           name: "",
  //           type: "address",
  //         },
  //       ],
  //       stateMutability: "view",
  //       type: "function",
  //     },
  //     {
  //       inputs: [
  //         {
  //           internalType: "uint256",
  //           name: "tokenId",
  //           type: "uint256",
  //         },
  //       ],
  //       name: "ownerOf",
  //       outputs: [
  //         {
  //           internalType: "address",
  //           name: "",
  //           type: "address",
  //         },
  //       ],
  //       stateMutability: "view",
  //       type: "function",
  //     },
  //     {
  //       inputs: [],
  //       name: "purchase",
  //       outputs: [
  //         {
  //           internalType: "uint256",
  //           name: "",
  //           type: "uint256",
  //         },
  //       ],
  //       stateMutability: "payable",
  //       type: "function",
  //     },
  //     {
  //       inputs: [],
  //       name: "renounceOwnership",
  //       outputs: [],
  //       stateMutability: "nonpayable",
  //       type: "function",
  //     },
  //     {
  //       inputs: [
  //         {
  //           internalType: "uint256",
  //           name: "",
  //           type: "uint256",
  //         },
  //         {
  //           internalType: "uint256",
  //           name: "_salePrice",
  //           type: "uint256",
  //         },
  //       ],
  //       name: "royaltyInfo",
  //       outputs: [
  //         {
  //           internalType: "address",
  //           name: "receiver",
  //           type: "address",
  //         },
  //         {
  //           internalType: "uint256",
  //           name: "royaltyAmount",
  //           type: "uint256",
  //         },
  //       ],
  //       stateMutability: "view",
  //       type: "function",
  //     },
  //     {
  //       inputs: [
  //         {
  //           internalType: "address",
  //           name: "from",
  //           type: "address",
  //         },
  //         {
  //           internalType: "address",
  //           name: "to",
  //           type: "address",
  //         },
  //         {
  //           internalType: "uint256",
  //           name: "tokenId",
  //           type: "uint256",
  //         },
  //       ],
  //       name: "safeTransferFrom",
  //       outputs: [],
  //       stateMutability: "nonpayable",
  //       type: "function",
  //     },
  //     {
  //       inputs: [
  //         {
  //           internalType: "address",
  //           name: "from",
  //           type: "address",
  //         },
  //         {
  //           internalType: "address",
  //           name: "to",
  //           type: "address",
  //         },
  //         {
  //           internalType: "uint256",
  //           name: "tokenId",
  //           type: "uint256",
  //         },
  //         {
  //           internalType: "bytes",
  //           name: "data",
  //           type: "bytes",
  //         },
  //       ],
  //       name: "safeTransferFrom",
  //       outputs: [],
  //       stateMutability: "nonpayable",
  //       type: "function",
  //     },
  //     {
  //       inputs: [],
  //       name: "salePrice",
  //       outputs: [
  //         {
  //           internalType: "uint256",
  //           name: "",
  //           type: "uint256",
  //         },
  //       ],
  //       stateMutability: "view",
  //       type: "function",
  //     },
  //     {
  //       inputs: [
  //         {
  //           internalType: "address",
  //           name: "operator",
  //           type: "address",
  //         },
  //         {
  //           internalType: "bool",
  //           name: "approved",
  //           type: "bool",
  //         },
  //       ],
  //       name: "setApprovalForAll",
  //       outputs: [],
  //       stateMutability: "nonpayable",
  //       type: "function",
  //     },
  //     {
  //       inputs: [
  //         {
  //           internalType: "address",
  //           name: "minter",
  //           type: "address",
  //         },
  //         {
  //           internalType: "bool",
  //           name: "allowed",
  //           type: "bool",
  //         },
  //       ],
  //       name: "setApprovedMinter",
  //       outputs: [],
  //       stateMutability: "nonpayable",
  //       type: "function",
  //     },
  //     {
  //       inputs: [
  //         {
  //           internalType: "bytes4",
  //           name: "interfaceId",
  //           type: "bytes4",
  //         },
  //       ],
  //       name: "supportsInterface",
  //       outputs: [
  //         {
  //           internalType: "bool",
  //           name: "",
  //           type: "bool",
  //         },
  //       ],
  //       stateMutability: "view",
  //       type: "function",
  //     },
  //     {
  //       inputs: [],
  //       name: "symbol",
  //       outputs: [
  //         {
  //           internalType: "string",
  //           name: "",
  //           type: "string",
  //         },
  //       ],
  //       stateMutability: "view",
  //       type: "function",
  //     },
  //     {
  //       inputs: [
  //         {
  //           internalType: "uint256",
  //           name: "tokenId",
  //           type: "uint256",
  //         },
  //       ],
  //       name: "tokenURI",
  //       outputs: [
  //         {
  //           internalType: "string",
  //           name: "",
  //           type: "string",
  //         },
  //       ],
  //       stateMutability: "view",
  //       type: "function",
  //     },
  //     {
  //       inputs: [],
  //       name: "totalSupply",
  //       outputs: [
  //         {
  //           internalType: "uint256",
  //           name: "",
  //           type: "uint256",
  //         },
  //       ],
  //       stateMutability: "view",
  //       type: "function",
  //     },
  //     {
  //       inputs: [
  //         {
  //           internalType: "address",
  //           name: "from",
  //           type: "address",
  //         },
  //         {
  //           internalType: "address",
  //           name: "to",
  //           type: "address",
  //         },
  //         {
  //           internalType: "uint256",
  //           name: "tokenId",
  //           type: "uint256",
  //         },
  //       ],
  //       name: "transferFrom",
  //       outputs: [],
  //       stateMutability: "nonpayable",
  //       type: "function",
  //     },
  //     {
  //       inputs: [
  //         {
  //           internalType: "address",
  //           name: "newOwner",
  //           type: "address",
  //         },
  //       ],
  //       name: "transferOwnership",
  //       outputs: [],
  //       stateMutability: "nonpayable",
  //       type: "function",
  //     },
  //     {
  //       inputs: [
  //         {
  //           internalType: "string",
  //           name: "_imageUrl",
  //           type: "string",
  //         },
  //       ],
  //       name: "updateEditionURLs",
  //       outputs: [],
  //       stateMutability: "nonpayable",
  //       type: "function",
  //     },
  //     {
  //       inputs: [],
  //       name: "withdraw",
  //       outputs: [],
  //       stateMutability: "nonpayable",
  //       type: "function",
  //     },
  //   ];
  //   const Contract_Address = nft.nft_id;
  //   const provider = new ethers.providers.Web3Provider(window.ethereum);

  //   await provider.send("eth_requestAccounts", []);
  //   const accounts = await provider.listAccounts();
  //   const signer = provider.getSigner(accounts[0]);

  //   const EditionContract = new ethers.Contract(Contract_Address, ABI, signer);

  //   const showImage = await EditionContract.getPrivateURI(0);
  //   console.log(showImage);
  //   return showImage;
  // };

  const showPrivImage = async (nft?: NFT) => {
    if (!nft) return;

    const ABI = [
      {
        inputs: [
          {
            internalType: "contract SharedNFTLogic",
            name: "_sharedNFTLogic",
            type: "address",
          },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        inputs: [],
        name: "TimeLimitReached",
        type: "error",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "approved",
            type: "address",
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "Approval",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "operator",
            type: "address",
          },
          {
            indexed: false,
            internalType: "bool",
            name: "approved",
            type: "bool",
          },
        ],
        name: "ApprovalForAll",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "uint256",
            name: "price",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "address",
            name: "owner",
            type: "address",
          },
        ],
        name: "EditionSold",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "uint8",
            name: "version",
            type: "uint8",
          },
        ],
        name: "Initialized",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "previousOwner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "newOwner",
            type: "address",
          },
        ],
        name: "OwnershipTransferred",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        name: "PriceChanged",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "Transfer",
        type: "event",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "approve",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
        ],
        name: "balanceOf",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "burn",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "contentType",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "description",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "editionSize",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "getApproved",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "getContentType",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "getCreatorName",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "getEndOfMintPeriod",
        outputs: [
          {
            internalType: "uint64",
            name: "",
            type: "uint64",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "getPrivateURI",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "getURIs",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "_owner",
            type: "address",
          },
          {
            internalType: "string",
            name: "_name",
            type: "string",
          },
          {
            internalType: "string",
            name: "_symbol",
            type: "string",
          },
          {
            internalType: "string",
            name: "_description",
            type: "string",
          },
          {
            internalType: "string",
            name: "_imageUrl",
            type: "string",
          },
          {
            internalType: "string",
            name: "_contentType",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "_editionSize",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "_royaltyBPS",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "_mintPeriodSeconds",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "_salePrice",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "_creatorName",
            type: "string",
          },
          {
            internalType: "string",
            name: "_privateImage",
            type: "string",
          },
        ],
        name: "initialize",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "address",
            name: "operator",
            type: "address",
          },
        ],
        name: "isApprovedForAll",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
        ],
        name: "mintEdition",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address[]",
            name: "recipients",
            type: "address[]",
          },
        ],
        name: "mintEditions",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "name",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "numberCanMint",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "owner",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "ownerOf",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "purchase",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "_salePrice",
            type: "uint256",
          },
        ],
        name: "royaltyInfo",
        outputs: [
          {
            internalType: "address",
            name: "receiver",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "royaltyAmount",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "safeTransferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
        ],
        name: "safeTransferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "salePrice",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "operator",
            type: "address",
          },
          {
            internalType: "bool",
            name: "approved",
            type: "bool",
          },
        ],
        name: "setApprovalForAll",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "minter",
            type: "address",
          },
          {
            internalType: "bool",
            name: "allowed",
            type: "bool",
          },
        ],
        name: "setApprovedMinter",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes4",
            name: "interfaceId",
            type: "bytes4",
          },
        ],
        name: "supportsInterface",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "symbol",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "tokenURI",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "totalSupply",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "transferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "newOwner",
            type: "address",
          },
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "string",
            name: "_imageUrl",
            type: "string",
          },
        ],
        name: "updateEditionURLs",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "withdraw",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ];
    const Contract_Address = nft.nft_id;
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    try {
      await provider.send("eth_requestAccounts", []);
      const accounts = await provider.listAccounts();
      const signer = provider.getSigner(accounts[0]);

      const EditionContract = new ethers.Contract(
        Contract_Address,
        ABI,
        signer
      );
      console.log(EditionContract);

      const showImage = await EditionContract.getPrivateURI(0);
      console.log(showImage);
      return showImage;
    } catch (error) {
      console.error("Error while fetching image:", error);
      return "Error";
    }
  };

  return { shareNFT, shareNFTOnTwitter, showPrivImage };
};
