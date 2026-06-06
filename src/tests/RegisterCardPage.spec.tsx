import { fireEvent, render, screen, waitFor } from "@testing-library/react";
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

  it("全項目入力して登録ボタンを押すと/に遷移する", async () => {
    renderRegisterCardPage();

    // getAllSkillsが非同期なので選択肢の描画を持つ
    await waitFor(() => {
      expect(
        screen.getByRole("option", { name: "TypeScript" }),
      ).toBeInTheDocument();
    });

    fireEvent.change(
      screen.getByPlaceholderText("好きな英単語を入力してください"),
      {
        target: { value: "test" },
      },
    );

    fireEvent.change(screen.getByPlaceholderText("山田太郎"), {
      target: { value: "テスト太郎" },
    });

    // descritionはminLength:10があるので10文字以上
    fireEvent.change(screen.getByPlaceholderText("自己紹介を入力"), {
      target: { value: "テスト用の自己紹介文です" },
    });

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "1" },
    });

    // @は不要 プレースホルダーが３つあるので、getAllByPlaceholderText で配列取得
    const optionalInputs = screen.getAllByPlaceholderText("@は不要");
    fireEvent.change(optionalInputs[0], { target: { value: "github-user" } });
    fireEvent.change(optionalInputs[1], { target: { value: "qiita-user" } });
    fireEvent.change(optionalInputs[2], { target: { value: "x-user" } });

    fireEvent.click(screen.getByRole("button", { name: "登録" }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("IDがないときにエラーメッセージが出る", async () => {
    renderRegisterCardPage();

    fireEvent.click(screen.getByRole("button", { name: "登録" }));

    await waitFor(() => {
      expect(screen.getByText("好きな英単語は必須です")).toBeInTheDocument();
    });
  });

  it("名前がないときにエラーメッセージが出る", async () => {
    renderRegisterCardPage();

    fireEvent.click(screen.getByRole("button", { name: "登録" }));

    await waitFor(() => {
      expect(screen.getByText("お名前は必須です")).toBeInTheDocument();
    });
  });

  it("紹介文がないときにエラーメッセージが出る", async () => {
    renderRegisterCardPage();

    fireEvent.click(screen.getByRole("button", { name: "登録" }));

    await waitFor(() => {
      expect(screen.getByText("自己紹介は必須です")).toBeInTheDocument();
    });
  });

  it("オプション(GitHub, Qiita, X)は空でも登録できる", async () => {
    renderRegisterCardPage();

    await waitFor(() => {
      expect(
        screen.getByRole("option", { name: "TypeScript" }),
      ).toBeInTheDocument();
    });

    fireEvent.change(
      screen.getByPlaceholderText("好きな英単語を入力してください"),
      {
        target: { value: "test" },
      },
    );

    fireEvent.change(screen.getByPlaceholderText("山田太郎"), {
      target: { value: "テスト太郎" },
    });

    fireEvent.change(screen.getByPlaceholderText("自己紹介を入力"), {
      target: { value: "テスト用の自己紹介文です" },
    });

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "1" },
    });

    fireEvent.click(screen.getByRole("button", { name: "登録" }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });
});
