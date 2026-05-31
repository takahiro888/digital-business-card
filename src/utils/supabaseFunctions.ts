import {
  type CardUser,
  type UserRow,
  type UserSkillRow,
  type SkillRow,
  createCardUser,
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
