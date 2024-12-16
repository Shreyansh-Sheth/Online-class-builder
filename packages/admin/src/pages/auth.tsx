import {
  Badge,
  Button,
  Center,
  Container,
  Paper,
  Stack,
  TextInput,
} from "@mantine/core";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { tokenState } from "../state/token";
import { trpc } from "../utils/trpc";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [key, setKey] = useRecoilState(tokenState);
  const navigate = useNavigate();

  useEffect(() => {
    //set key on session storage as token
    if (key) {
      sessionStorage.setItem("token", key);
    }
  }, [key]);

  useEffect(() => {
    const mainKey = sessionStorage.getItem("token");
    checkAdminMutate.mutate(undefined, {
      onSuccess: (data) => {
        navigate("/dashboard");
      },
      onSettled: (data, error) => {
        checkAdminMutate.reset();
      },
    });
  }, []);
  const checkAdminMutate = trpc.admin.checkAdmin.useMutation();
  return (
    <Container>
      <Paper>
        <Stack>
          <Badge>Please Provide Keys</Badge>
          <TextInput
            label="Secret Key"
            value={key}
            onChange={(e) => {
              setKey(e.target.value);
            }}
          />
          <Button
            onClick={() => {
              checkAdminMutate.mutate(undefined, {
                onSuccess: (data) => {
                  alert("Logged In");
                  navigate("/dashboard");
                },
                onError: () => {
                  alert("Bad Key");
                },
              });
            }}
          >
            Continue
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
