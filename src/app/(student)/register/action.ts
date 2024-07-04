"use server";

import { createClient } from "@/lib/supabase/server";
import { Student } from "@/types/student";
import { redirect } from "next/navigation";

export async function register(form: Student) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("students")
    .insert(form)
    .select()
    .single();

  if (data) {
    redirect("/");
  }

  return;
}
