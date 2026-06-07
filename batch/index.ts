import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_ANON_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const getTodayStart = () => {
  const now = new Date();
  now.setUTCHours(0, 0, 0, 0);
  return now.toISOString();
};

const deletePreviousDayData = async () => {
  const todayStart = getTodayStart();
  console.log(`Deleting data before ${todayStart}`);

  const { data: users, error: fetchError } = await supabase
    .from("users")
    .select("id")
    .lt("created_at", todayStart); // 今日の0時より前に作成されたユーザーを取得

  if (fetchError) {
    console.error("Failed to fetch users:", fetchError);
    process.exit(1);
  }

  if (!users || users.length === 0) {
    console.log("No users found for the previous day.");
    return;
  }

  const userIds = users.map((user) => user.id);
  console.log(`Found ${userIds.length} users to delete.`);

  // user_skillを先に削除(FK制約のため)
  const { error: skillError, count: skillCount } = await supabase
    .from("user_skill")
    .delete({ count: "exact" })
    .in("user_id", userIds);

  if (skillError) {
    console.error("Failed to delete user_skill:", skillError);
    process.exit(1);
  }

  console.log(`Deleted ${skillCount} user_skill rows.`);

  // usersを削除
  const { error: userError, count: userCount } = await supabase
    .from("users")
    .delete({ count: "exact" })
    .in("id", userIds);

  if (userError) {
    console.error("Failed to delete users:", userError);
    process.exit(1);
  }

  console.log(`Deleted ${userCount} user rows.`);
};

deletePreviousDayData();
