import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function getDataById(id) {
  const { data, error } = await supabase
    .from("route") // 테이블 이름
    .select("*") // 가져올 컬럼들 (모두 가져오려면 '*')
    .eq("id", id); // 특정 id에 해당하는 데이터만 가져오기

  if (error) {
    console.error("Error fetching data:", error);
    return null;
  }

  return data;
}

export async function getAllData() {
  const { data, error } = await supabase.from("route").select("*");

  if (error) {
    console.error("Error fetching data:", error);
    return null;
  }

  return data;
}
