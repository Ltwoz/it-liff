"use server";

import { createClient } from "@/lib/supabase/server";
import { Student } from "@/types/student";

export async function register(form: Student) {
  const supabase = createClient();

  const { data, error } = await supabase.from("students").insert(form);

  console.log(data, error);

  return;
}
