import useSWR from "swr";

import { fetcher } from "../use-infinite-list-query";
import { MyInfo } from "./../../types";

// export interface UserItemType {
//   img_url?: string;
//   name?: string;
//   profile_id: number;
//   timestamp?: string;
//   username?: string;
//   verified?: boolean;
//   wallet_address?: string;
//   // follows_you?: boolean;
// }

interface FollowData {
  data: {
    list: MyInfo[];
  };
}

export function useFollowersList(profileId?: string) {
  const { data, error } = useSWR<FollowData>(
    profileId
      ? `/api/people?want=followers&limit=500&profile_id=${profileId}`
      : null,
    fetcher
  );
  // console.log(`USEFOLLOWDATA=${data}`);

  return {
    data: data?.data,
    loading: !data,
    error,
  };
}

export function useFollowingList(profileId?: string) {
  const { data, error } = useSWR(
    profileId
      ? `api/peoples?want=following&limit=500&profile_id=${profileId}`
      : null,
    fetcher
  );

  // console.log(`USEFOLLOWINGDATA=${JSON.stringify(data)}`);
  // console.log(profileId);
  return {
    data: data?.data,
    loading: !data,
    error,
  };
}
