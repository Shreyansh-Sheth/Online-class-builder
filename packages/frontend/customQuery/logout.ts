import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";

export function useLogoutEndUserMutation() {
  return useMutation(async (data: { storeFrontId: string }) => {
    return await axios.post(
      "/api/enduser/auth/logout",
      {
        ...data,
      },
      { withCredentials: true }
    );
  });
}
