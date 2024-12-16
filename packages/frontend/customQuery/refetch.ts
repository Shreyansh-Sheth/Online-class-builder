import { useQuery, useMutation } from "@tanstack/react-query";
import { storeFrontId } from "@tutor/validation/lib/storefront";
import axios from "axios";
import { useRecoilState } from "recoil";
import { accessTokenAtom } from "../state/accessTokenAtom";

export function useRefetchCookiesMutation(data: { storeFrontId: string }) {
  const [accessToken, setAccessToken] = useRecoilState(accessTokenAtom);
  return useQuery(
    ["Refetch-Cookies"],
    async () => {
      return await axios.post(
        "/api/enduser/auth/revalidate",
        {
          ...data,
        },
        { withCredentials: true }
      );
    },
    {
      enabled: !!storeFrontId,
      refetchInterval: 10000,
      retry: 0,
      onSuccess(data) {
        setAccessToken(data.data.token);
        window.localStorage.setItem("accessToken", data.data.token);
      },
    }
  );
}
