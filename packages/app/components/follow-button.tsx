import { useState, useCallback, memo, useMemo } from "react";

import { Alert } from "@showtime-xyz/universal.alert";
import { Button } from "@showtime-xyz/universal.button";
import type { ButtonProps } from "@showtime-xyz/universal.button/types";

import { useMyInfo } from "app/hooks/api-hooks";

type ToggleFollowParams = ButtonProps & {
  name?: string;
  profileId: string;
  onToggleFollow?: () => void;
};

export const FollowButton = memo<ToggleFollowParams>(
  ({ profileId, name, onToggleFollow, ...rest }) => {
    const { unfollow, follow, data, isFollowing: isFollowingFn } = useMyInfo();
    const [isFollowing, setIsFollowing] = useState(isFollowingFn(profileId));

    useMemo(() => {
      setIsFollowing(isFollowingFn(profileId));
    }, [profileId, isFollowingFn]);

    const toggleFollow = useCallback(async () => {
      if (isFollowing) {
        Alert.alert(`Unfollow ${name ? `@${name}` : ""}?`, "", [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Unfollow",
            style: "destructive",
            onPress: async () => {
              await unfollow(profileId);
              setIsFollowing(false);
              onToggleFollow?.();
            },
          },
        ]);
      } else {
        await follow(profileId);
        setIsFollowing(true);
        onToggleFollow?.();
      }
    }, [follow, unfollow, isFollowing, profileId, name, onToggleFollow]);

    if (data?.data?.data?.profile?._id === profileId) return null;
    return (
      <Button
        variant={isFollowing ? "tertiary" : "primary"}
        onPress={toggleFollow}
        {...rest}
      >
        {isFollowing ? "Following" : "Follow"}
      </Button>
    );
  }
);

FollowButton.displayName = "FollowButton";
