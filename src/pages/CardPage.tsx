import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { CardUser } from "@/domain/user";
import { getUserWithSkills } from "@/utils/supabaseFunctions";

export function CardPage() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<CardUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) {
        return;
      }

      const result = await getUserWithSkills(id);

      if (!result) {
        return;
      }
      setUser(result);
      setIsLoading(false);
    };

    void fetchUser();
  }, [id]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <p>ID: {user?.id}</p>
      <p>名前: {user?.name}</p>
      <p>自己紹介: {user?.description}</p>
      <h2>スキル</h2>
      <ul>
        {user.skills.map((skill) => (
          <li key={skill.id}>{skill.name}</li>
        ))}
      </ul>
      {/* <div dangerouslySetInnerHTML={{ __html: user?.description }} /> */}
      <a href={user?.githubUrl} target="_blank" rel="noopener noreferrer">
        GitHub
      </a>
      <br />
      <a href={user?.qiitaUrl} target="_blank" rel="noopener noreferrer">
        Qiita
      </a>
      <br />
      <a href={user?.xUrl} target="_blank" rel="noopener noreferrer">
        X
      </a>
    </div>
  );
}
