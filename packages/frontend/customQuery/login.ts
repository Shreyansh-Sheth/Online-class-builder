import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRecoilState } from "recoil";
import { accessTokenAtom } from "../state/accessTokenAtom";

export function useLoginEndUserMutation() {
  const [_, setAccessToken] = useRecoilState(accessTokenAtom);
  return useMutation(
    async (data: { email: string; password: string; storefrontId: string }) => {
      return await axios.post(
        "/api/enduser/auth/login",
        {
          ...data,
        },
        { withCredentials: true }
      );
    },
    {
      onSuccess(data, variables, context) {
        setAccessToken(data.data.token);
        window.localStorage.setItem("accessToken", data.data.token);
      },
    }
  );
}
