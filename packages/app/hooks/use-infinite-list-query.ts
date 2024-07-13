import { useState, useEffect } from "react";

import type { KeyedMutator } from "swr";
import useSWRInfinite from "swr/infinite";

import { axios } from "app/lib/axios";

//url: urls.url + "?wallet=" + walletAddress

export const fetcher = (url: string) => {
  return axios({ url, method: "GET" });
};

type UseInfiniteListQueryReturn<T> = {
  error?: string;
  data?: Array<T>;
  isLoading: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  isReachingEnd: boolean;
  fetchMore: () => void;
  refresh: () => void;
  retry: () => void;
  mutate: KeyedMutator<T[]>;
};
type UseInfiniteListConfig = {
  refreshInterval?: number;
  pageSize?: number;
};
export const useInfiniteListQuerySWR = <T>(
  urlFunction: (pageIndex: number, previousPageData: []) => string | null,
  config?: UseInfiniteListConfig
): UseInfiniteListQueryReturn<T> => {
  const refreshInterval = config?.refreshInterval ?? 0;
  const PAGE_SIZE = config?.pageSize ?? 0;

  // Todo:: on Refresh, swr will refetch all the page APIs. This may appear weird at first, but I guess could be better for UX
  // We don't want to show loading indicator till all of the requests succeed, so we'll add our refreshing state
  // and set it to false even when first request is completed.
  const [isRefreshing, setRefreshing] = useState(false);
  const { data, error, mutate, size, setSize, isValidating, isLoading } =
    useSWRInfinite<T>(urlFunction, fetcher, {
      revalidateFirstPage: true,
      // suspense: true,
      refreshInterval,
      revalidateOnMount: true,
    });
  console.log(`FeÇIR= ${JSON.stringify(urlFunction())}`);
  const isRefreshingSWR = isValidating && data && data.length === size;
  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    (isLoadingInitialData ||
      (size > 0 && data && typeof data[size - 1] === "undefined")) ??
    false;
  const isEmpty = (data?.[0] as any)?.length === 0;

  const isReachingEnd = !PAGE_SIZE
    ? true
    : isEmpty ||
      ((data && (data[data.length - 1] as any)?.length < PAGE_SIZE) ?? true);

  useEffect(() => {
    if (!isRefreshingSWR) {
      setRefreshing(false);
    }
  }, [isRefreshingSWR]);

  const fetchMore = () => {
    if (isLoadingMore || isReachingEnd) return;
    setSize((size) => size + 1);
  };
  console.log(`DATAINFQUE= ${JSON.stringify(data)}`);
  return {
    data,
    error,
    refresh: () => {
      setRefreshing(true);
      mutate();
      // hide refresh indicator in max 4 seconds due to above reason
      setTimeout(() => {
        setRefreshing(false);
      }, 4000);
    },
    fetchMore,
    retry: mutate,
    isLoading,
    isLoadingMore,
    isRefreshing,
    mutate,
    isReachingEnd,
  };
};
