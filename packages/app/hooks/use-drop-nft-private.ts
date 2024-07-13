import { useReducer, useCallback } from "react";

import { useStorageUpload } from "@thirdweb-dev/react";
import { ethers } from "ethers";

import { useAlert } from "@showtime-xyz/universal.alert";

import { useMatchMutate } from "app/hooks/use-match-mutate";
import { Logger } from "app/lib/logger";
import { captureException } from "app/lib/sentry";
import { getFileMeta } from "app/utilities";

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // in bytes

type IEdition = {
  editionId: string;
  creator: string;
  editionSize: number;
  editionContractAddress: string;
  creatorName: string;
  data: any;
};

type State = {
  status: "idle" | "loading" | "success" | "error";
  //transactionHash?: string;
  edition?: IEdition;
  //transactionId?: any;
  error?: string;
  //signaturePrompt?: boolean;
};

type Action = {
  error?: string;
  type: string;
  //transactionHash?: string;
  edition?: IEdition;
  //transactionId?: any;
};

const initialState: State = {
  status: "idle",
  //signaturePrompt: false,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "loading":
      return { ...initialState, status: "loading" };
    case "success":
      return { ...state, status: "success", edition: action.edition };
    case "error":
      return {
        ...state,
        status: "error",
        error: action.error,
        //signaturePrompt: false,
      };
    case "reset": {
      return initialState;
    }
    case "transactionHash":
      return {
        ...state,
        transactionHash: action.transactionHash,
        transactionId: action.transactionId,
      };
    case "signaturePrompt": {
      return {
        ...state,
        signaturePrompt: true,
      };
    }
    case "signatureSuccess": {
      return {
        ...state,
        signaturePrompt: false,
      };
    }
    default:
      return state;
  }
};

export type UseDropNFT = {
  title: string;
  description: string;
  file: File | string;
  file2?: File | string;
  editionSize: number;
  royalty: number;
  duration: number;
  notSafeForWork: boolean;
  symbol?: string;
  animationUrl?: string;
  animationHash?: string;
  imageHash?: string;
  // spotifyUrl?: string;
  // gatingType?: "spotify_save" | "password" | "location" | "multi";
  password?: string;
  googleMapsUrl?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  price?: string;
};

export const useDropNFT = () => {
  //const uploadMedia = useUploadMediaToPinata();
  const [state, dispatch] = useReducer(reducer, initialState);
  const mutate = useMatchMutate();
  const Alert = useAlert();
  const { mutateAsync: upload } = useStorageUpload();
  //ETHERS JS
  let EditionCreatorContract: any;
  const Contract_Address = process.env.NEXT_PUBLIC_MINTING_CONTRACT;
  const ABI = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_implementation",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "editionId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "creator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "editionSize",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "editionContractAddress",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "creatorName",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "hasPrivImage",
          "type": "bool"
        }
      ],
      "name": "CreatedEdition",
      "type": "event"
    },
    {
      "inputs": [
        { "internalType": "string", "name": "_name", "type": "string" },
        { "internalType": "string", "name": "_symbol", "type": "string" },
        { "internalType": "string", "name": "_description", "type": "string" },
        { "internalType": "string", "name": "_imageUrl", "type": "string" },
        { "internalType": "string", "name": "_contentType", "type": "string" },
        { "internalType": "uint256", "name": "_editionSize", "type": "uint256" },
        { "internalType": "uint256", "name": "_royaltyBPS", "type": "uint256" },
        {
          "internalType": "uint256",
          "name": "_mintPeriodSeconds",
          "type": "uint256"
        },
        { "internalType": "uint256", "name": "_salePrice", "type": "uint256" },
        { "internalType": "string", "name": "_creatorName", "type": "string" },
        { "internalType": "bool", "name": "_hasPrivImage", "type": "bool" },
        { "internalType": "string", "name": "_privateImage", "type": "string" }
      ],
      "name": "createEdition",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "uint256", "name": "editionId", "type": "uint256" }
      ],
      "name": "getEditionAtId",
      "outputs": [
        { "internalType": "contract Edition", "name": "", "type": "address" }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "implementation",
      "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  provider.send("eth_requestAccounts", []).then(() => {
    provider.listAccounts().then((accounts) => {
      const signer = provider.getSigner(accounts[0]);

      /* 3.1 Create instance of pet smart contract */
      EditionCreatorContract = new ethers.Contract(
        Contract_Address,
        ABI,
        signer
      );
    });
  });

  const dropNFT = async (
    params: UseDropNFT,
    callback?: () => void,
    username: string,
    privateHash
  ) => {
    try {
      const fileMetaData = await getFileMeta(params.file2);
      // let privImage;

      if (
        fileMetaData &&
        typeof fileMetaData.size === "number" &&
        fileMetaData.size > MAX_FILE_SIZE
      ) {
        Alert.alert(
          `This file is too big. Please use a file smaller than 50 MB.`
        );
        return;
      }

      dispatch({ type: "loading" });

      const privateImageURL = await upload({
        data: [params.file2],
        options: {
          uploadWithGatewayUrl: true,
          uploadWithoutDirectory: true,
        },
      });

      // const price = params.price ? params.price : "0";
      const price = ethers.utils.parseEther(`${params.price}`)
      console.log("PRICA"+ price)

      const publicImage = `https://ipfs.io/ipfs/${privateHash.IPFSHash}`;
      const hasPrivImage = true;

      EditionCreatorContract.createEdition(
        params.title, //name
        `Only ${params.title}`, //symbol
        params.description,
        publicImage, //imageURL
        privateHash.type,
        params.editionSize,
        params.royalty,
        params.duration, //mintPeriodSeconds
        price, //YOK
        username, //CreatorName
        hasPrivImage,
        privateImageURL[0]//PRIVURL
      );

      EditionCreatorContract.on(
        "CreatedEdition",
        (
          editionId,
          creator,
          editionSize,
          editionContractAddress,
          creatorName,
          event
        ) => {
          let info = {
            editionId,
            creator,
            editionSize,
            editionContractAddress,
            creatorName,
            data: event,
          };
          console.log("COntractINFO" + JSON.stringify(info));
          dispatch({ type: "success", edition: info });
        }
      );
    } catch (e: any) {
      dispatch({ type: "error", error: e?.message });
      Logger.error("nft drop failed", e);

      if (e?.response?.status === 420) {
        Alert.alert(
          "Wow, you love drops!",
          "Only one drop per day is allowed. Come back tomorrow!"
        );
      }

      if (e?.response?.status === 500) {
        Alert.alert(
          "Oops. An error occurred.",
          "We are currently experiencing a lot of usage. Please try again in one hour!"
        );
      }

      captureException(e);
    }
  };
  //END Of UseDropFunction
  const onReconnectWallet = useCallback(() => {
    dispatch({
      type: "error",
      error: "Please try again...",
    });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: "reset" });
  }, []);

  return {
    dropNFT,
    state,
    onReconnectWallet,
    reset,
  };
};
