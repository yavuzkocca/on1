import { useUser } from "app/hooks/use-user";

function useCurrentUserId() {
  const { user } = useUser();
  const userId = user?.data?.data?.profile?._id;

  return userId;
}

export { useCurrentUserId };
