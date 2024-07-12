"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState, useRef } from "react";
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
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { locationCheck, pinCheck } from "@/actions/checkinActions";
import { Input } from "@/components/ui/input";

interface Employee {
  id: string;
  name: string;
  role: string;
  shift: string;
  contact_info: string | null;
}

const FormSchema = z.object({
  pin: z.string().min(4, {
    message: "Your one-time password must be 4 characters.",
  }),
  reason: z.string().optional(),
});

const CheckinPage = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
      reason: "",
    },
  });

  const [locationAllowed, setLocationAllowed] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<string | undefined>("");
  const [employee, setEmployee] = useState<Employee>();
  const submitRef = useRef<HTMLButtonElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await locationCheck(latitude, longitude);
          if (response) {
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
        const response = await pinCheck(data);
        if (!response) {
          toast({
            title: "Error",
            description: "User not found or invalid pin",
            variant: "destructive",
          });
          return;
        }
        setSuccess(true);
        setEmployee(response!.employee);
        setType(response!.type);
      } catch (error) {
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
              {employee && (
                <h1 className="text-4xl font-bold text-primary text-center">
                  {employee.name}
                </h1>
              )}
              <CardTitle className="text-primary text-center text-2xl">
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
          className={`h-screen flex flex-col justify-center ${
            loading ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          <Card className="mx-auto max-w-sm">
            <CardHeader>
              <h1 className="text-4xl font-bold text-primary">Check in/out</h1>
              <CardDescription>
                Check in to your account by entering your passcode.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-full">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className=" space-y-5"
                >
                  <FormField
                    control={form.control}
                    name="pin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {locationAllowed ? (
                            <span> 4 digits passcode for your account</span>
                          ) : (
                            <span className="text-red-600">
                              {" "}
                              Turn on location{" "}
                            </span>
                          )}
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
                  <FormField
                    control={form.control}
                    name="reason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reason (Late/Early Leave)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter your reason" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="w-full flex justify-end">
                    <Button
                      ref={submitRef}
                      type="submit"
                      disabled={loading}
                      className="mr-3 mt-5"
                    >
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
