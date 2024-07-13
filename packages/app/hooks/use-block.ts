import { useCallback } from "react";

import { useAlert } from "@showtime-xyz/universal.alert";
import { useToast } from "@showtime-xyz/universal.toast";

import { axios } from "app/lib/axios";

import { getAccessToken } from "../lib/access-token";
import { useNavigateToLogin } from "../navigation/use-navigate-to";
import { useUser } from "./use-user";

type ToggleBlockUserParams = {
  isBlocked: boolean;
  creatorId?: string;
  name?: string;
  /**
   * on blocked success callback
   */
  onBlocked?: () => void;
};
function useBlock() {
  //#region hooks
  const toast = useToast();
  // const { mutate } = useSWRConfig();
  const { user, mutate, isAuthenticated } = useUser();
  const navigateToLogin = useNavigateToLogin();
  const Alert = useAlert();
  const accessToken = getAccessToken();
  //#endregion
  // console.log(`useBlockUSER=${JSON.stringify(user)}`);
  //#region methods
  const getIsBlocked = useCallback(
    function isBlocked(userId?: string) {
      // console.log(`UserID=${userId}`);
      return userId === undefined
        ? false
        : user?.data?.data?.blocked_profile_ids?.includes(userId) ?? false;
    },
    [user?.data?.data?.blocked_profile_ids]
  );

  const block = useCallback(
    async function block(userId?: string) {
      if (userId === undefined) {
        return;
      }

      await axios({
        url: `/api/users/block_profile`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: { blocked_profile_id: userId },
      });

      // mutate user data
      mutate(
        (data) => ({
          data: {
            ...data!.data,
            blocked_profile_ids: [...data!.data.blocked_profile_ids, userId],
          },
        }),
        true
      );
      toast?.show({ message: "Blocked!", hideAfter: 4000 });
    },
    [toast, mutate]
  );
  const unblock = useCallback(
    async function unblock(userId?: string) {
      if (userId === undefined) {
        return;
      }
      await axios({
        url: `/api/users/unblock_profile`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: { blocked_profile_id: userId },
      });

      // mutate user data
      mutate(
        (data) => ({
          data: {
            ...data!.data,
            blocked_profile_ids: data!.data.blocked_profile_ids.filter(
              (id) => id !== userId
            ),
          },
        }),
        false
      );
      toast?.show({ message: "Unblocked!", hideAfter: 4000 });
    },
    [toast, mutate]
  );
  const toggleBlock = useCallback(
    async function toggleBlock({
      isBlocked,
      creatorId,
      name,
      onBlocked,
    }: ToggleBlockUserParams) {
      if (!creatorId) return;
      if (!isAuthenticated) return navigateToLogin();
      if (isBlocked) {
        await unblock(creatorId);
      } else {
        Alert.alert(`Block ${name ? `@${name}` : ""}?`, "", [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Block",
            style: "destructive",
            onPress: async () => {
              await block(creatorId);
              onBlocked?.();
            },
          },
        ]);
      }
    },
    [Alert, block, isAuthenticated, navigateToLogin, unblock]
  );
  //#endregion
  return {
    getIsBlocked,
    block,
    unblock,
    toggleBlock,
  };
}

export { useBlock };
