"use client";

import { useEffect, useState } from "react";
import liff from "@line/liff";
import { IProfile } from "@/types/profile";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";

const liffId = process.env.NEXT_PUBLIC_LIFF_ID || "";

const formSchema = z.object({
  studentCode: z.string().min(11),
  studentName: z.string().min(3),
  level: z.string().min(1),
});

const options = [
  {
    label: "ปวช.1",
    value: "1",
  },
  {
    label: "ปวช.2",
    value: "2",
  },
  {
    label: "ปวช.3",
    value: "3",
  },
  {
    label: "ปวส.1",
    value: "4",
  },
  {
    label: "ปวส.2",
    value: "5",
  },
];

export default function Home() {
  const [profile, setProfile] = useState<IProfile>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentCode: "",
      studentName: "",
      level: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  useEffect(() => {
    (async () => {
      // const liff = (await import('@line/liff')).default;
      await liff.init({ liffId });

      if (liff.isLoggedIn()) {
        setProfile(await liff.getProfile());
      } else {
        liff.login();
      }
    })();
  }, []);

  const logout = () => {
    liff.logout();
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center gap-y-6 px-10">
      <Avatar className="w-16 h-16">
        <AvatarImage src={profile?.pictureUrl} />
        <AvatarFallback>Profile</AvatarFallback>
      </Avatar>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 w-full md:w-2/5"
        >
          <FormField
            control={form.control}
            name="studentCode"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="รหัสนักศึกษา" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="studentName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="ชื่อ-นามสกุล" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Combobox options={options} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={!isValid}>
            ยืนยัน
          </Button>
        </form>
      </Form>
    </div>
  );
}
