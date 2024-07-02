"use client";

import { useCallback, useEffect, useState } from "react";
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
import { createClient } from "@/lib/supabase/client";
import { Level } from "@/types/level";
import { useLiff } from "@/providers/liff-provider";

const formSchema = z.object({
  studentCode: z.string().min(11),
  studentName: z.string().min(3),
  level: z.string().min(1),
});

type LevelOption = {
  value: string;
  label: string;
};

export default function RegisterForm() {
  const supabase = createClient();

  const { liff } = useLiff();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<IProfile>();
  const [levels, setLevels] = useState<LevelOption[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentCode: "",
      studentName: "",
      level: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const getLevel = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase.from("levels").select("*");

      if (error) {
        throw error;
      }

      const formattedData = data?.map(
        (item: Level): LevelOption => ({
          value: item.level_code,
          label: item.level_name,
        })
      );

      if (data) {
        setLevels(formattedData);
      }
    } catch (error) {
      alert("Error loading user data!");
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    if (!liff?.isLoggedIn()) return;
    (async () => {
      setProfile(await liff.getProfile());
    })();
  }, [liff]);

  useEffect(() => {
    getLevel();
  }, [getLevel]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center gap-y-6 px-10">
      <h1>ลงทะเบียน</h1>
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
                  <Combobox options={levels} {...field} searchable={false} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={!isValid}>
            ลงทะเบียน
          </Button>
        </form>
      </Form>
    </div>
  );
}
