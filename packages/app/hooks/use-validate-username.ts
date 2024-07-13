import { useRef, useState, useEffect } from "react";

import { axios } from "../lib/axios";
import { useUser } from "./use-user";

export const useValidateUsername = () => {
  const [isValid, setIsValid] = useState(true);
  const [isTaken, setIsTaken] = useState(false);
  const { user } = useUser();
  const debounceTimeout = useRef<any>(null);

  useEffect(() => {
    const hasUsername = user?.data?.data.profile.username.toLowerCase() == "";
    //console.log("MUSERN" + hasUsername);
    if (hasUsername == false) {
      setIsTaken(true);
    }
  }, [user]);

  async function validateUsername(value: string) {
    const username = value ? value.trim() : null;

    try {
      if (
        username === null ||
        username.toLowerCase() === user?.data?.profile?.username?.toLowerCase()
      ) {
        setIsValid(true);
      } else if (username.length > 1) {
        const res = await axios({
          url: `/v1/username_available?username=${username}`,
          method: "get",
        });

        if (res.data) {
          setIsValid(true);
        } else {
          setIsValid(false);
        }
      }
    } catch (e) {
      console.error("username validate api failed ", e);
    }
  }

  console.log(`isVAlidddd=${isValid}`);

  function debouncedValidate(value: string) {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      validateUsername(value);
    }, 400);
  }

  return {
    isValid,
    isTaken,
    validate: debouncedValidate,
  };
};
