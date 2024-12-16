import {
  Badge,
  Button,
  ButtonProps,
  Group,
  Loader,
  useMantineTheme,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { accessTokenAtom } from "../../state/accessTokenAtom";
import { trpc } from "../../utils/trpc";

export function BuyNowButton({
  courseId,
  ...props
}: ButtonProps & { courseId: string }) {
  const router = useRouter();
  const { id } = router.query;
  const [accessToken] = useRecoilState(accessTokenAtom);
  const { data: me } = trpc.endUser.me.getMe.useQuery();

  const getOrderIdMutation = trpc.endUser.payment.createOrderId.useMutation();
  const { data: paymentData, isLoading: paymentLoading } =
    trpc.endUser.payment.paymentStatus.useQuery(
      {
        courseId,
      },
      {
        retry: false,
        enabled: !!courseId,
      }
    );
  const { data: storefrontData } = trpc.site.byDomain.useQuery(
    typeof window === "undefined" ? "" : window.location.host,
    { enabled: typeof window !== "undefined" }
  );
  const { data: courseData, isLoading } =
    trpc.endUser.course.getCourseById.useQuery(
      {
        courseId: courseId!,
      },
      {
        enabled: !!courseId,
      }
    );
  const theme = useMantineTheme();
  const trpcContext = trpc.useContext();
  const verifyPaymentTrpc = trpc.endUser.payment.verifyPayment.useMutation();
  if (paymentLoading) {
    return <Loader size="sm" />;
  }
  if (paymentData?.status === "paid") {
    return (
      <Group position="right">
        <Badge>You Own This</Badge>
      </Group>
    );
  }
  return (
    <Button
      variant="filled"
      fullWidth
      mt="md"
      radius="md"
      {...props}
      disabled={!courseId}
      onClick={() => {
        if (!courseId) {
          return;
        }
        if (!me) {
          router.push("/enduser/register");
        } else {
          // console.log(window.location.hostname);
          getOrderIdMutation.mutateAsync(
            {
              courseId: courseId,
            },
            {
              onError: (err) => {
                console.log(err);

                showNotification({
                  title: "Error",
                  message:
                    "Store Has Not Been Setup Or There Might Me Other Issue Contact Admin".toLocaleLowerCase(),
                  color: "red",
                });
              },
              onSuccess(data, variables, context) {
                if (!data) {
                  showNotification({
                    color: "red",
                    title: "Error",
                    message: "Something went wrong",
                  });
                  return;
                }
                if (data.free === true) {
                  trpcContext.endUser.course.getCourseById.invalidate({
                    courseId: courseId,
                  });
                  showNotification({
                    color: "green",
                    title: "Error",
                    message: "Thank you for your purchase",
                  });
                  return;
                }
                if (!data.order) {
                  showNotification({
                    color: "red",
                    title: "Error",
                    message: "Something went wrong",
                  });
                  return;
                }

                const option = {
                  key: "rzp_test_EOKWyFEhGAqFMN",
                  name: storefrontData?.name,
                  description: courseData?.name,
                  //TODO image from storefront
                  image: storefrontData?.iconUrl?.url,
                  order_id: data.order.id,
                  theme: {
                    color: theme.fn.primaryColor(),
                  },
                  prefill: {
                    email: me.email,
                    name: me.name,
                  },
                  handler: function (response: any) {
                    // console.log(response + "RESPONSe");
                    showNotification({
                      loading: true,
                      id: "payment",
                      title: "Payment Successful",
                      message: "Thank you for your purchase",
                      color: "green",
                      autoClose: 5000,
                    });
                    verifyPaymentTrpc.mutate(
                      {
                        ...response,
                      },
                      {
                        onSuccess(data, variables, context) {
                          //refetch course

                          trpcContext.endUser.course.getCourseById.invalidate({
                            courseId: courseId,
                          });
                          showNotification({
                            loading: false,
                            id: "payment",
                            title: "Payment Successful",
                            message: "Thank you for your purchase",
                            color: "green",
                            autoClose: 5000,
                          });
                        },
                      }
                    );
                  },
                };

                const rzp = new (window as any).Razorpay(option);
                rzp.on(
                  "payment.failed",
                  function (response: {
                    error: {
                      code: string;
                      description: string;
                      source: string;
                      step: string;
                      reason: string;
                    };
                  }) {
                    showNotification({
                      color: "red",
                      loading: false,
                      title: response.error.code,
                      message: response.error.description,
                    });
                  }
                );
                rzp.open();
              },
            }
          );
        }
      }}
    >
      Buy Now
    </Button>
  );
}
