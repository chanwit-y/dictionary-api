import { createClient } from "jsr:@supabase/supabase-js@2";
import { Env } from "../config/index.ts";

const supabaseUrl = Env.supabaseUrl!;
const supabaseKey = Env.supabaseKey!;
const supabase = createClient(supabaseUrl, supabaseKey);

export const findAll = async (table: string) => {
  let { data: eng_to_tha, error } = await supabase
    .from("eng_to_tha")
    .select("*");
  if (error) {
    console.log(error);
    return error;
  }
  console.log(eng_to_tha);
  return eng_to_tha;
};
