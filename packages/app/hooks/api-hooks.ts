import { useCallback, useMemo } from "react";

import useSWR, { useSWRConfig } from "swr";

import { axios } from "app/lib/axios";
import { useNavigateToLogin } from "app/navigation/use-navigate-to";
import { MyInfo, NFT, Profile } from "app/types";

import { getAccessToken } from "../lib/access-token";
import { useAuth } from "./auth/use-auth";
import { useInfiniteListQuerySWR, fetcher } from "./use-infinite-list-query";

export const useActivity = ({
  typeId,
  limit = 5,
}: {
  typeId: number;
  limit?: number;
}) => {
  const { accessToken } = useAuth();

  const activityURLFn = useCallback(
    (index: number) => {
      const url = `/v2/${
        accessToken ? "activity_with_auth" : "activity_without_auth"
      }?page=${index + 1}&type_id=${typeId}&limit=${limit}`;
      return url;
    },
    [typeId, limit, accessToken]
  );

  const queryState = useInfiniteListQuerySWR<any>(activityURLFn, {
    pageSize: limit,
  });

  const newData = useMemo(() => {
    let newData: any = [];
    if (queryState.data) {
      // filter if duplicate data shows up in pagingation. Flatlist starts acting weird on receiving duplicates
      // It can happen if database is updating and we are fetching new data.
      // As new post shows on top, fetching next page can have same post as previous page.
      // TODO: Cursor based pagination in API?
      queryState.data.forEach((page) => {
        if (page) {
          page.data = page.data.filter((d: any) => {
            const v = newData.find((x: any) => x.id === d.id);
            if (v === undefined) {
              return true;
            }
            if (__DEV__) {
              console.log("duplicate record in feed ", d.id);
            }
            return false;
          });
          newData = newData.concat(page.data);
        }
      });
    }
    return newData;
  }, [queryState.data]);

  return { ...queryState, data: newData };
};

export const useTrendingCreators = ({ days }: { days: number }) => {
  const PAGE_SIZE = 15;
  const trendingCreatorsUrlFn = useCallback(
    (index: number) => {
      const url = `/v1/leaderboard?page=${
        index + 1
      }&days=${days}&limit=${PAGE_SIZE}`;
      return url;
    },
    [days]
  );

  const queryState = useInfiniteListQuerySWR<any>(trendingCreatorsUrlFn, {
    pageSize: PAGE_SIZE,
  });
  const newData = useMemo(() => {
    let newData: any = [];
    if (queryState.data) {
      queryState.data.forEach((p) => {
        if (p) {
          newData = newData.concat(p.data);
        }
      });
    }
    return newData;
  }, [queryState.data]);

  return {
    ...queryState,
    data: newData,
    fetchMore: useCallback(() => {}, []),
  };
};

export const useTrendingNFTS = ({ days }: { days: number }) => {
  const trendingUrlFn = useCallback(() => {
    const url = `/api/v2/trending/nfts?timeframe=${
      days === 1 ? "day" : days === 7 ? "week" : days === 30 ? "month" : "all"
    }`;
    return url;
  }, [days]);

  const { data, isLoading, error, mutate } = useSWR<NFT[]>(
    trendingUrlFn,
    fetcher
  );

  return { data: data ?? [], isLoading, error, mutate };
};

export const USER_PROFILE_KEY = "/api/profile_server/";
export const useUserProfile = ({ address }: { address?: string | null }) => {
  const walletAddress = localStorage.getItem("wallet");
  const queryKey = walletAddress ? USER_PROFILE_KEY + address : null;
  const { data, error, isLoading } = useSWR<{
    data?: MyInfo;
  }>(queryKey, fetcher);
  const { mutate } = useSWRConfig();

  //const { data: myInfoData } = useMyInfo();
  // if it's current user's profile, we get the profile from my info cache to make mutation easier, e.g. mutating username
  const userProfile: typeof data = useMemo(() => {
    return data;
  }, [data]);
  // console.log(`QKey=${queryKey}`);
  // console.log(`APIHOOKSDATA=${JSON.stringify(data)}`);

  return {
    data: userProfile,
    isLoading,
    isError: Boolean(error),
    error,
    mutate: () => mutate(queryKey, userProfile),
  };
};

export interface UserProfile {
  profile: Profile;
  following_count: number;
  followers_count: number;
  featured_nft: NFT;
  follows_you: boolean;
  following_creator_drops: boolean;
}

type UserProfileNFTs = {
  profileId?: number;
  tabType?: string;
  sortType?: string;
  showHidden?: number;
  collectionId?: number;
  refreshInterval?: number;
};

type UseProfileNFTs = {
  items: Array<NFT>;
  has_more: boolean;
};

export const defaultFilters = {
  showHidden: 0,
  collectionId: 0,
  sortType: "newest",
};

export const PROFILE_NFTS_QUERY_KEY = "api/v2/profile-tabs/nfts";

export const useProfileNFTs = (params: UserProfileNFTs) => {
  const PAGE_SIZE = 12;
  const {
    profileId,
    tabType,
    sortType = defaultFilters.sortType,
    showHidden = defaultFilters.showHidden,
    collectionId = defaultFilters.collectionId,
    refreshInterval,
  } = params;

  const trendingCreatorsUrlFn = useCallback(
    (index: number) => {
      const url = `${PROFILE_NFTS_QUERY_KEY}?profile_id=${profileId}&page=${
        index + 1
      }&limit=${PAGE_SIZE}&tab_type=${tabType}&sort_type=${sortType}&show_hidden=${showHidden}&collection_id=${collectionId}`;
      return url;
    },
    [profileId, tabType, sortType, showHidden, collectionId]
  );

  const { mutate, ...queryState } = useInfiniteListQuerySWR<UseProfileNFTs>(
    params?.profileId && tabType ? trendingCreatorsUrlFn : () => null,
    { refreshInterval, pageSize: PAGE_SIZE }
  );

  const newData = useMemo(() => {
    let newData: NFT[] = [];
    if (queryState.data) {
      queryState.data.forEach((p) => {
        if (p) {
          newData = newData.concat(p.items);
        }
      });
    }
    return newData;
  }, [queryState.data]);
  console.log(`PROFNEWDATA ${JSON.stringify(newData)}`);

  const fetchMore = () => {
    if (queryState.data?.[queryState.data.length - 1].has_more) {
      queryState.fetchMore();
    }
  };

  const updateItem = useCallback(
    (updatedItem: NFT) => {
      mutate((d) => {
        const updatedData = d?.map((d) => {
          return {
            ...d,
            items: d.items.map((item: NFT) => {
              if (item.nft_id === updatedItem.nft_id) {
                return updatedItem;
              }
              return item;
            }),
          };
        });
        return updatedData;
      });
    },
    [mutate]
  );

  return { ...queryState, fetchMore, updateItem, data: newData };
};

export type Collection = {
  collection_id: number;
  collection_name: string;
  collection_img_url: string;
  count?: number;
};

export type List = {
  collections: Array<Collection>;
  displayed_count: number;
  has_custom_sort: boolean;
  name: string;
  sort_type: string;
  type: string;
  user_has_hidden_items: boolean;
};

export type ProfileTabsAPI = {
  default_tab_type: string;
  tabs: Array<List>;
};

export const useProfileNftTabs = ({ profileId }: { profileId?: number }) => {
  const { data, error, isLoading } = useSWR<ProfileTabsAPI>(
    profileId ? "/api/v2/profile-tabs/tabs?profile_id=" + profileId : null,
    fetcher
  );
  console.log(`PROFTABSdata ${JSON.stringify(data)}`);
  return { data, isLoading, error };
};

export const useComments = ({ nftId }: { nftId: number }) => {
  const PAGE_SIZE = 10;
  const commentsUrlFn = useCallback(() => {
    const url = `/api/comments/${nftId}?limit=${PAGE_SIZE}`;
    return url;
  }, [nftId]);

  const queryState = useInfiniteListQuerySWR<any>(commentsUrlFn, {
    pageSize: PAGE_SIZE,
  });

  return queryState;
};

export const useMyInfo = () => {
  const walletAddress = localStorage.getItem("wallet");
  const accessToken = getAccessToken();
  const queryKey = `api/users/myinfo?wallet=${walletAddress}`;
  const { mutate } = useSWRConfig();
  const navigateToLogin = useNavigateToLogin();
  const { data, error } = useSWR<MyInfo>(
    accessToken ? queryKey : null,
    fetcher
  );
  //console.log(`USEMYINFO=${JSON.stringify(data.data.data)}`);
  const follow = useCallback(
    async (profileId: string) => {
      if (!accessToken) {
        navigateToLogin();
        return;
      }

      // if (data) {
      //   mutate(
      //     queryKey,
      //     {
      //       data: {
      //         ...data.data.data,
      //         followings: [...data.data.data.followings, { _id: profileId }],
      //       },
      //     },
      //     false
      //   );

      try {
        await axios({
          url: `/api/users/follow/${profileId}`,
          method: "POST",
          data: {},
        });
      } catch (err) {
        console.error(err);
      }

      // mutate(queryKey);
    },
    [accessToken, data, navigateToLogin]
  );

  const unfollow = useCallback(
    async (profileId?: string) => {
      if (data) {
        // mutate(
        //   queryKey,
        //   {
        //     data: {
        //       ...data.data.data,
        //       followings: data.data.data.followings.filter(
        //         (follow) => follow !== profileId
        //       ),
        //     },
        //   },
        //   false
        // );

        try {
          await axios({
            url: `/api/users/unfollow/${profileId}`,
            method: "POST",
            data: {},
          });
        } catch (err) {
          console.error(err);
        }

        // mutate(queryKey);
      }
    },
    [data]
  );

  const isFollowing = useCallback(
    (userId: string) => {
      return Boolean(
        data?.data?.data?.followings?.find((follow) => follow === userId)
      );
    },
    [data]
  );

  const like = useCallback(
    async (nftId: string) => {
      if (!accessToken) {
        navigateToLogin();
        // TODO: perform the action post login
        return false;
      }

      if (data) {
        try {
          mutate(
            queryKey,
            {
              data: {
                ...data.data.data,
                likes_nft: [...data.data.data.likes_nft, nftId],
              },
            },
            false
          );

          await axios({
            url: `/api/users/likenft/${nftId}`,
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            data: {},
          });

          mutate(queryKey);

          return true;
        } catch (error) {
          mutate(queryKey);
          return false;
        }
      }
    },
    [data, accessToken, mutate, navigateToLogin]
  );

  const unlike = useCallback(
    async (nftId: string) => {
      if (data) {
        try {
          mutate(
            queryKey,
            {
              data: {
                ...data.data.data,
                likes_nft: data.data.data.likes_nft.filter(
                  (id) => id !== nftId
                ),
              },
            },
            false
          );

          await axios({
            url: `/api/users/unlikenft/${nftId}`,
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            data: {},
          });

          mutate(queryKey);
          return true;
        } catch (error) {
          mutate(queryKey);
          return false;
        }
      }
    },
    [data, mutate]
  );

  const isLiked = useCallback(
    (nftId: string) => {
      return data?.data?.data?.likes_nft?.includes(nftId);
    },
    [data]
  );

  const refetchMyInfo = useCallback(() => {
    mutate(queryKey);
  }, [mutate]);

  return {
    data,
    loading: !data,
    error,
    follow,
    unfollow,
    isFollowing,
    like,
    unlike,
    isLiked,
    refetchMyInfo,
  };
};
