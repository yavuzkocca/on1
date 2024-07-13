import { useMemo, useCallback, useState } from "react";

import { useSWRConfig } from "swr";

import { useInfiniteListQuerySWR } from "app/hooks/use-infinite-list-query";
import { axios } from "app/lib/axios";

import { getAccessToken } from "../../lib/access-token";
import { Data } from "./use-comments";

export interface Liker {
  profile_id: number;
  verified: number;
  wallet_address: string;
  name: string;
  img_url: string;
  timestamp: string;
  username: string;
  _id: string;
}

export interface CommentType {
  _id: string;
  added: string;
  text: string;
  commenter_profile_id: string;
  nft_id: string;
  name: string;
  img_url: string;
  address: string;
  username: string;
  verified: number;
  like_count: number;
  likers: Liker[];
  parent_id?: number;
  replies?: CommentType[];
}

export interface Data {
  comments: CommentType[];
  // has_more: boolean;
}

export interface CommentsPayload {
  data: Data;
}
const accessToken = getAccessToken();
console.log("ACCCS" + accessToken);

export const useComments = (nftId?: number) => {
  //#region state
  const [isSubmitting, setIsSubmitting] = useState(false);
  //#endregion

  //#region hooks
  const { mutate } = useSWRConfig();
  const fetchCommentsURL = useCallback(
    function fetchCommentsURL() {
      // TODO: uncomment when pagination is fixed.
      // return `/v2/comments/${nftId}?limit=10&page=${index + 1}`;
      return nftId ? `/api/comments/${nftId}` : null;
    },
    [nftId]
  );

  const {
    data,
    isLoading,
    isLoadingMore,
    isRefreshing,
    error,
    fetchMore,
    refresh,
    mutate: mutateComments,
  } = useInfiniteListQuerySWR<CommentsPayload>(fetchCommentsURL);

  const commentsCount = useMemo(() => {
    return data?.[0].data.length ?? 0;
  }, [data]);
  //#endregion
  // console.log(`CommentsCountData=${JSON.stringify(data[0])}`);

  // console.log(`CommentsCount=${commentsCount}`);
  //#region callbacks
  const likeComment = useCallback(
    async function likeComment(commentId: string) {
      try {
        await axios({
          url: `/api/comments/likecomment/${commentId}`,
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          data: {},
        });

        const walletAddress = localStorage.getItem("wallet");

        // Veriyi güncellemeden önce, yeni veriye ihtiyacımız var. Bu nedenle mutate fonksiyonunu kullanarak yeniden veri getiriyoruz.
        const newData = await mutate(
          `/api/users/myinfo?wallet=${walletAddress}`
        );
        console.log("CMMTS" + JSON.stringify(newData));

        // Yeni veriyi kullanarak, kullanıcı bilgilerini güncelliyoruz.
        if (newData) {
          mutate(
            `/api/users/myinfo?wallet=${walletAddress}`,
            {
              data: {
                ...newData.data,
                likes_comment: [...newData.data.likes_comment, commentId],
              },
            },
            false
          ); // Opsiyonel olarak, güncelleme sonrasında yeniden yükleme yapmayı engellemek için false değeri veriyoruz.
        }

        return true;
      } catch (error) {
        return false;
      }
    },
    [mutate, accessToken]
  );

  const unlikeComment = useCallback(
    async function unlikeComment(commentId: string) {
      try {
        // Yorumu beğenmekten farklı olarak, yorumu beğenmemek için sunucuya bir DELETE isteği gönderiyoruz.
        await axios({
          url: `/api/comments/unlikecomment/${commentId}`,
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          data: {}, // DELETE isteği genellikle bir veri içermez, bu yüzden boş bir nesne gönderiyoruz.
        });

        const walletAddress = localStorage.getItem("wallet");
        const newData = await mutate(
          `/api/users/myinfo?wallet=${walletAddress}`
        );

        // Veriyi güncellemek için kopyasını oluşturun ve beğenilmeyen yorumu çıkarın
        if (newData) {
          const updatedData = {
            ...newData,
            data: {
              ...newData.data,
              likes_comment: newData.data.likes_comment.filter(
                (item) => item !== commentId
              ),
            },
          };

          // Güncellenmiş veriyi mutate fonksiyonuna ileterek kullanıcı verilerini güncelleyin
          await mutate(
            `/api/users/myinfo?wallet=${walletAddress}`,
            updatedData
          );
        }

        return true;
      } catch (error) {
        console.error("Error:", error);
        return false;
      }
    },
    [mutate, accessToken]
  );

  const deleteComment = useCallback(
    async function deleteComment(commentId: string) {
      await axios({
        url: `/api/comments/deletecomment/${commentId}`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: {},
      });

      mutateComments((data) => {
        if (data?.data) {
          data.data = deleteCommentRecursively(commentId, data);
        }
        return data.data;
      }, true);
    },
    [mutateComments]
  );

  const newComment = useCallback(
    async function newComment(message: string, parentId: string | null = null) {
      try {
        setIsSubmitting(true);
        await axios({
          url: `/api/comments/newcomment/${nftId}`,
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          data: {
            message: message,
            parent_id: parentId,
          },
        });

        // mutate comments
        mutateComments();

        const walletAddress = localStorage.getItem("wallet");

        // Veriyi güncellemeden önce, yeni veriye ihtiyacımız var. Bu nedenle mutate fonksiyonunu kullanarak yeniden veri getiriyoruz.
        const newData = await mutate(
          `/api/users/myinfo?wallet=${walletAddress}`
        );

        setIsSubmitting(false);
      } catch (error) {
        setIsSubmitting(false);
        throw error;
      }
    },
    [nftId, mutateComments]
  );
  //#endregion

  return {
    error,
    data: data?.[0].data,

    isSubmitting,
    isLoading,
    isLoadingMore,
    isRefreshing,

    commentsCount,

    refresh,
    fetchMore,

    likeComment,
    unlikeComment,
    deleteComment,
    newComment,
  };
};

const deleteCommentRecursively = (
  commentId: number,
  comments?: CommentType[]
) => {
  return (
    comments?.reduce((result, comment) => {
      if (comment._id == commentId) {
        return result;
      }

      if (comment.replies && comment.replies.length > 0) {
        comment.replies = deleteCommentRecursively(commentId, comment.replies);
      }

      result.push(comment);
      return result;
    }, [] as CommentType[]) || []
  );
};
