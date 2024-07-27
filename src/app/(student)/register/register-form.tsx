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
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from 'next/image'
import { StudentIcon, NameIcon, EmailIcon, PhoneNumberIcon } from '@/icons/iconsSVG';

const formSchema = z.object({
  code: z.string().min(11, { message: "รหัสนักศึกษาต้องมีอย่างน้อย 11 ตัวอักษร" }),
  name: z.string().min(3, { message: "กรุณากรอก ชื่อ-นามสกุลให้ถูกต้อง" }),
  level: z.string().min(1, { message: "กรุณาเลือกระดับชั้น" }),
  email: z.string().email({ message: "กรุณาใส่อีเมล์ที่ถูกต้อง" }),
  phone_no: z.string().min(10, { message: "เบอร์โทรศัพท์ต้องมีความยาวอย่างน้อย 10 ตัวอักษร" }),
});


export type StudentType = z.infer<typeof formSchema>;

type LevelOption = {
  value: string;
  label: string;
};

export default function RegisterForm() {
  const supabase = createClient();

  const router = useRouter();
  const { liff } = useLiff();

  const [profile, setProfile] = useState<IProfile>();
  const [levels, setLevels] = useState<LevelOption[]>([]);

  const form = useForm<StudentType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      name: "",
      level: "",
      email: "",
      phone_no: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const getLevel = useCallback(async () => {
    try {
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
      console.log(error);
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

  const onSubmit = async (values: StudentType) => {
    const { data, error } = await supabase
      .from("students")
      .insert({
        ...values,
        line_uid: profile?.userId,
      })
      .select()
      .single();

    if (data) {
      toast.success("Register success");
      setTimeout(() => {
        if (liff) {
          liff.closeWindow();
        }
      }, 2000);
    } else {
      toast.error("Something went wrong");
    }

    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: values.code,
        name: values.name,
        level: values.level,
        userId: profile?.userId
      }),
    });

    if (response.ok) {
      alert('Registration Succesfully!');
    } else {
      alert('Fail to make Registration');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg flex flex-col md:flex-row w-full max-w-4xl mx-auto">
        <div className="flex flex-col justify-center p-8 w-full md:w-1/2">
          <h1 className="text-2xl font-bold mb-4 text-center">ลงทะเบียน</h1>
          <div className="flex justify-center mb-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={profile?.pictureUrl} />
              <AvatarFallback>Profile</AvatarFallback>
            </Avatar>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 w-full"
            >
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
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="รหัสนักศึกษา" icon={StudentIcon} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="ชื่อ-นามสกุล" icon={NameIcon} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="อีเมล" icon={EmailIcon} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone_no"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="เบอร์โทรศัพท์" icon={PhoneNumberIcon} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={!isValid || isSubmitting}>
                  ลงทะเบียน
                </Button>
              </div>
            </form>
          </Form>
        </div>
        <div className="hidden md:block w-full md:w-1/2">
          <Image
            src="/BG.png"
            alt="School"
            width={500}
            height={500}
            className="rounded-b-lg md:rounded-r-lg md:rounded-bl-none h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}