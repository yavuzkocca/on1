// import Iron from "@hapi/iron";

import { useCallback, useRef } from "react";

import * as accessTokenStorage from "app/lib/access-token";
import * as refreshTokenStorage from "app/lib/refresh-token";

export function useAccessTokenManager() {
  const isRefreshing = useRef(false);
  const accessToken = accessTokenStorage.useAccessToken();
  const refreshToken = refreshTokenStorage.useRefreshToken();

  //#region setters/getters
  const setAccessToken = useCallback(async function setAccessToken(
    accessToken: string
  ) {
    if (!accessToken || accessToken.length === 0) return;
    accessTokenStorage.setAccessToken(accessToken);
  },
  []);
  const setRefreshToken = useCallback(async function setRefreshToken(
    refreshToken: string
  ) {
    if (!refreshToken || refreshToken.length === 0) return;
    // const sealedRefreshToken = await Iron.seal(
    //   { refreshToken },
    //   //@ts-ignore
    //   process.env.ENCRYPTION_SECRET_V2,
    //   Iron.defaults
    // );
    refreshTokenStorage.setRefreshToken(refreshToken);
  },
  []);
  const setTokens = useCallback(
    async function setTokens(accessToken: string, refreshToken: string) {
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
    },
    [setAccessToken, setRefreshToken]
  );
  //#endregion

  //#region methods
  const refreshTokens = useCallback(
    async function refreshTokens() {
      if (isRefreshing.current) {
        return;
      }
      isRefreshing.current = true;

      try {
        // Get refresh token
        // const sealedRefreshToken = refreshTokenStorage.getRefreshToken();
        // if (!sealedRefreshToken) {
        //   throw "Missing sealed refresh token";
        // }

        // TODO: unseal refresh token
        // const { refreshToken } = await Iron.unseal(
        //   sealedRefreshToken,
        //   // @ts-ignore
        //   process.env.ENCRYPTION_SECRET_V2,
        //   Iron.defaults
        // );

        // Call refresh API
        // const response = await axios({
        //   url: `/api/validate`,
        //   method: 'POST',
        //   data: {
        //     refresh: refreshTokenStorage.getRefreshToken()
        //   }
        // });

        const _accessToken = response?.access;
        const _refreshToken = response?.refresh;

        setAccessToken(_accessToken);
        setRefreshToken(_refreshToken);

        isRefreshing.current = false;
        response.send("OK");
      } catch (error: any) {
        isRefreshing.current = false;

        

        throw `Failed to refresh tokens. ${
          typeof error === "string" ? error : error.message || ""
        }`;
      }
    },
    [setAccessToken, setRefreshToken]
  );
  //#endregion

  return {
    setTokens,
    setAccessToken,
    setRefreshToken,
    refreshTokens,
    accessToken,
    refreshToken,
  };
}
