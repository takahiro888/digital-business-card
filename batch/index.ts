import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_ANON_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const getPreviousDayRange = () => {
  const now = new Date();
  const start = new Date(now);
  start.setUTCDate(now.getUTCDate() - 1);
  start.setUTCHours(0, 0, 0, 0);

  const end = new Date(now);
  end.setUTCDate(now.getUTCDate() - 1);
  end.setUTCHours(23, 59, 59, 999);

  return { start: start.toISOString(), end: end.toISOString() };
};

const deletePreviousDayData = async () => {
  const { start, end } = getPreviousDayRange();
  console.log(`Deleting data from ${start} to ${end}`);

  const { data: users, error: fetchError } = await supabase
    .from("cards")
    .select("id")
    .gte("created_at", start)
    .lte("created_at", end);

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
