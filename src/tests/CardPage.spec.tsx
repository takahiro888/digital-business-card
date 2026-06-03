import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CardUser } from "@/domain/user";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

// react-router-domのモック
const mockNavigate = vi.fn();

// react-router-domのモック
vi.mock("react-router-dom", () => ({
  useParams: () => ({ id: "testuser" }),
  useNavigate: () => mockNavigate,
}));

// suppabase関数のモック
vi.mock("@/utils/supabaseFunctions", () => ({
  getUserWithSkills: vi.fn(),
}));

import { getUserWithSkills } from "@/utils/supabaseFunctions";
import { CardPage } from "@/pages/CardPage";
import { Provider } from "@/components/ui/provider";

//テスト用のフィクスチャ
const mockUser: CardUser = {
  id: "testuser",
  name: "テストユーザー",
  description: "自己紹介テキスト",
  github_id: "test-github",
  qiita_id: "test-qiita",
  x_id: "test-x",
  created_at: "2024-01-01T00:00:00Z",
  skills: [
    {
      id: 1,
      name: "TypeScript",
      created_at: "2024-01-01T00:00:00Z",
    },
  ],
  githubUrl: "https://github.com/test-github",
  qiitaUrl: "https://qiita.com/test-qiita",
  xUrl: "https://twitter.com/test-x",
};

// ChakraUIProviderでラップするヘルパー
const renderCardPage = () =>
  render(
    <Provider>
      <CardPage />
    </Provider>,
  );

describe("CardPage", () => {
  beforeEach(() => {
    vi.mocked(getUserWithSkills).mockResolvedValue(mockUser);
    mockNavigate.mockReset();
  });

  it("名前が表示されている", async () => {
    renderCardPage();
    await waitFor(() => {
      expect(screen.getByText("テストユーザー")).toBeInTheDocument();
    });
  });
  it("自己紹介が表示されている", async () => {
    renderCardPage();
    await waitFor(() => {
      expect(screen.getByText("自己紹介テキスト")).toBeInTheDocument();
    });
  });
  it("技術が表示されている", async () => {
    renderCardPage();
    await waitFor(() => {
      expect(screen.getByText("TypeScript")).toBeInTheDocument();
    });
  });
  it("GitHubアイコンが表示されている", async () => {
    renderCardPage();
    await waitFor(() => {
      expect(screen.getByRole("link", { name: "GitHub" })).toBeInTheDocument();
    });
  });
  it("Qiitaアイコンが表示されている", async () => {
    renderCardPage();
    await waitFor(() => {
      expect(screen.getByRole("link", { name: "Qiita" })).toBeInTheDocument();
    });
  });
  it("Xアイコンが表示されている", async () => {
    renderCardPage();
    await waitFor(() => {
      expect(screen.getByRole("link", { name: "X" })).toBeInTheDocument();
    });
  });

  it("戻るボタンをクリックすると/に遷移する", async () => {
    renderCardPage();
    await waitFor(() => {
      expect(screen.getByText("ホームへ戻る")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText("ホームへ戻る"));
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
