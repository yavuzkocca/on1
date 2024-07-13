import useSWR from "swr";
import useUnmountSignal from "use-unmount-signal";

import { axios } from "app/lib/axios";

interface UserItemType {
  img_url?: string;
  name?: string;
  profile_id: number;
  username?: string;
  verified?: boolean;
  wallet_address?: string;
}

export interface Data {
  likers: UserItemType[];
}

interface LikesPayload {
  data: Data;
}

export function useLikes(nftId?: number) {
  const unmountSignal = useUnmountSignal();
  const { data, error } = useSWR<LikesPayload>(
    nftId ? "/api/likes/" + nftId : null,
    (url) => axios({ url, method: "GET", unmountSignal })
  );
  console.log(data);

  return {
    data: data?.data,
    loading: !data,
    error,
  };
}
