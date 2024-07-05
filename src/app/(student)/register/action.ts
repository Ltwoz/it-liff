"use server";

import { createClient } from "@/lib/supabase/server";
import { Student } from "@/types/student";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";

export async function register(form: Student) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("students")
    .insert(form)
    .select()
    .single();

  if (data) {
    toast.success("Register success");
    redirect("/");
  } else {
    toast.error("Something went wrong");
  }

  return;
}
