import {
  type CardUser,
  type UserRow,
  type UserSkillRow,
  type SkillRow,
  createCardUser,
  type UserInsert,
} from "../domain/user";
import { supabase } from "./supabaseClient";

// ユーザIDからユーザ情報を取得する関数
export const getUserById = async (userId: string): Promise<UserRow | null> => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) {
    console.error("Error fetching users:", error);
    return null;
  }
  return data as UserRow;
};

// ユーザIDからユーザのスキルリンクを取得する関数
export const getUserSkillLinks = async (
  userId: string,
): Promise<UserSkillRow[]> => {
  const { data, error } = await supabase
    .from("user_skill")
    .select("skill_id")
    .eq("user_id", userId);
  if (error) {
    console.error("Error fetching user skills:", error);
    return [];
  }
  return data as UserSkillRow[];
};

// スキルIDの配列からスキル情報を取得する関数
export const getSkillsByIds = async (
  skillIds: number[],
): Promise<SkillRow[]> => {
  if (skillIds.length === 0) {
    return [];
  }
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .in("id", skillIds);
  if (error) {
    console.error("Error fetching skills:", error);
    return [];
  }
  return data as SkillRow[];
};

// ユーザIDからユーザ情報とスキル情報をまとめて取得する関数
export const getUserWithSkills = async (
  userId: string,
): Promise<CardUser | null> => {
  const user = await getUserById(userId);
  if (!user) {
    return null;
  }
  const links = await getUserSkillLinks(userId);
  const skillIds = links.map((link) => link.skill_id);
  const skills = await getSkillsByIds(skillIds);
  return createCardUser(user, skills);
};

// skills テーブルの全権を取得する(登録フォームの選択肢に使用)
export const getAllSkills = async (): Promise<SkillRow[]> => {
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .order("id", { ascending: true });
  if (error) {
    console.error("Error fetching all skills:", error);
    return [];
  }
  return data as SkillRow[];
};

// 空文字をnullに変換するヘルパー（SNS IDの未入力対応）
const toNullableString = (value: string): string | null => {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

// usersテーブルにユーザーを登録する
// ID重複時はErrorをthrowする
export const createUser = async (params: {
  id: string;
  name: string;
  description: string;
  githubId?: string;
  qiitaId?: string;
  xId?: string;
}): Promise<UserRow> => {
  const payload: UserInsert = {
    id: params.id.trim(),
    name: params.name.trim(),
    description: params.description.trim(),
    github_id: toNullableString(params.githubId ?? ""),
    qiita_id: toNullableString(params.qiitaId ?? ""),
    x_id: toNullableString(params.xId ?? ""),
  };

  const { data, error } = await supabase
    .from("users")
    .insert(payload)
    .select("*")
    .single();

  if (error?.code === "23505") {
    const duplicateError = new Error(
      "ユーザーIDが既に存在しています。別のIDを選択してください。",
    );
    duplicateError.name = "ID_DUPLICATE";
    throw duplicateError;
  }
  if (error) {
    throw error;
  }

  return data as UserRow;
};

// 選んだ技術wをUserSkillテーブルに登録する
export const linkUserSkills = async (
  userId: string,
  skillId: number,
): Promise<void> => {
  const { error } = await supabase
    .from("user_skill")
    .insert({ user_id: userId, skill_id: skillId });
  if (error) throw error;
};
