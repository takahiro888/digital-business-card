export type UserRow = {
  id: string;
  name: string;
  description: string;
  github_id: string;
  qiita_id: string;
  x_id: string;
  created_at: string;
};

// export class UserRow {
//   public id: number;
//   public name: string;
//   public description: string;
//   public github_id: string;
//   public qiita_id: string;
//   public x_id: string;
//   public created_at: string | null;

//   constructor(
//     id: number,
//     name: string,
//     description: string,
//     github_id: string,
//     qiita_id: string,
//     x_id: string,
//     created_at: string | null,
//   ) {
//     this.id = id;
//     this.name = name;
//     this.description = description;
//     this.github_id = github_id;
//     this.qiita_id = qiita_id;
//     this.x_id = x_id;
//     this.created_at = created_at;
//   }
// }

export type UserSkillRow = {
  id: number;
  user_id: string;
  skill_id: number;
  created_at: string;
};

export type SkillRow = {
  id: number;
  name: string;
  created_at: string;
};

export type CardUser = UserRow & {
  skills: SkillRow[];
  githubUrl: string | null;
  qiitaUrl: string | null;
  xUrl: string | null;
};

export type SocialLink = {
  label: "GitHub" | "Qiita" | "X";
  url: string;
};

const hasValue = (value: string) => value.trim().length > 0;

const toGithubUrl = (id: string) =>
  hasValue(id) ? `https://github.com/${id.trim()}` : null;
const toQiitaUrl = (id: string) =>
  hasValue(id) ? `https://qiita.com/${id.trim()}` : null;
const toXUrl = (id: string) =>
  hasValue(id) ? `https://twitter.com/${id.trim()}` : null;

export const createCardUser = (
  user: UserRow,
  skills: SkillRow[],
): CardUser => ({
  ...user,
  skills,
  githubUrl: toGithubUrl(user.github_id),
  qiitaUrl: toQiitaUrl(user.qiita_id),
  xUrl: toXUrl(user.x_id),
});

export const getSocialLinks = (user: CardUser): SocialLink[] => {
  const links: SocialLink[] = [];

  if (user.githubUrl) {
    links.push({ label: "GitHub", url: user.githubUrl });
  }
  if (user.qiitaUrl) {
    links.push({ label: "Qiita", url: user.qiitaUrl });
  }
  if (user.xUrl) {
    links.push({ label: "X", url: user.xUrl });
  }
  return links;
};
