import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// react-router-domのモック
const mockNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

// supabaseFuncitonsのモック
vi.mock("@/utils/supabaseFunctions", () => ({
  getAllSkills: vi.fn(),
  createUser: vi.fn(),
  linkUserSkill: vi.fn(),
}));

// モック宣言後にimport
import { Provider } from "@/components/ui/provider";
import { RegisterCardPage } from "@/pages/RegisterCardPage";
import {
  createUser,
  getAllSkills,
  linkUserSkills,
} from "@/utils/supabaseFunctions";

const renderRegisterCardPage = () =>
  render(
    <Provider>
      <RegisterCardPage />
    </Provider>,
  );

describe("RegisterCardPage", () => {
  beforeEach(() => {
    vi.mocked(getAllSkills).mockResolvedValue([
      { id: 1, name: "TypeScript", created_at: "2024-01-01T00:00:00Z" },
    ]);
    vi.mocked(createUser).mockResolvedValue({
      id: "testuser",
      name: "テストユーザー",
      description: "テスト用の自己紹介です",
      github_id: "",
      qiita_id: "",
      x_id: "",
      created_at: "2024-01-01T00:00:00Z",
    });
    vi.mocked(linkUserSkills).mockResolvedValue(undefined);
    mockNavigate.mockReset();
  });

  it("タイトルが表示されている", () => {
    renderRegisterCardPage();
    expect(
      screen.getByRole("heading", { name: "新規名刺登録" }),
    ).toBeInTheDocument();
  });

  
});
