"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useToast } from "@/components/ui/use-toast";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, LoaderCircle } from "lucide-react";

const FormSchema = z.object({
  pin: z.string().min(4, {
    message: "Your one-time password must be 4 characters.",
  }),
});

const CheckinPage = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  const [locationAllowed, setLocationAllowed] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await axios.post("/api/checkin/location", {
            lat: latitude,
            lng: longitude,
          });
          if (response.data.allowed) {
            setLocationAllowed(true);
          }
        } catch (error) {
          console.error("Error sending check-in request:", error);
        }
      });
    }
  }, []);

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    const sendCheckinRequest = async () => {
      setLoading(true);
      try {
        const response = await axios.post("/api/checkin", { pin: data.pin });
        if (response.status === 200) {
          if (response.data.employee) {
            setSuccess(true);
          }
          setType(response.data.attendance);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Error checking in",
          variant: "destructive",
        });
        console.error("Error checking in:", error);
      } finally {
        setLoading(false);
      }
    };

    sendCheckinRequest();
  };

  return (
    <div className="w-full max-h-screen flex items-center justify-center">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <LoaderCircle className="w-12 h-12 text-primary animate-spin" />
        </div>
      )}
      {success ? (
        <div className="h-screen flex flex-col justify-center">
          <Card className="mx-auto max-w-sm w-[384px] h-[300px] ">
            <CardHeader>
              <CardTitle className="text-primary text-center text-4xl">
                {type === "check-in" ? (
                  <span>Check-in</span>
                ) : (
                  <span>Check-out</span>
                )}{" "}
                Successfully
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center -mt-5">
              <DotLottieReact
                src="https://lottie.host/ef1ed44d-27dd-4080-a875-337a4ce5ebee/r2Ws8ntDl6.json"
                autoplay
                style={{ width: "100%", height: "100%" }}
              ></DotLottieReact>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div
          className={`h-screen flex flex-col justify-center ${loading ? "opacity-50 pointer-events-none" : ""}`}
        >
          <Card className="mx-auto max-w-sm">
            <CardHeader>
              <h1 className="text-4xl font-bold text-primary">Check in</h1>
              <CardDescription>
                Check in to your account by entering your passcode.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-full">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className=" space-y-10"
                >
                  <FormField
                    control={form.control}
                    name="pin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          4 digits passcode for your account
                        </FormLabel>
                        <FormControl>
                          <InputOTP
                            maxLength={4}
                            {...field}
                            disabled={!locationAllowed}
                          >
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="w-full flex justify-end">
                    <Button type="submit" disabled={loading} className="mr-3">
                      Submit <ArrowRight className="ml-2" />
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CheckinPage;
