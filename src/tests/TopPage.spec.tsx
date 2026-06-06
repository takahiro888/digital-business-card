import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
// react-router-domのモック
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import { TopPage } from "@/pages/TopPage";
import { Provider } from "@/components/ui/provider";

const renderTopPage = () =>
  render(
    <MemoryRouter>
      <Provider>
        <TopPage />
      </Provider>
    </MemoryRouter>,
  );

describe("TopPage", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
  });

  it("タイトルが表示されている", () => {
    renderTopPage();
    expect(
      screen.getByRole("heading", { name: "デジタル名刺アプリ" }),
    ).toBeInTheDocument();
  });

  it("IDを入力してボタンを押すと/cards/:idに遷移する", () => {
    renderTopPage();

    fireEvent.change(screen.getByPlaceholderText("IDを入力してください"), {
      target: { value: "testuser" },
    });

    fireEvent.click(screen.getByRole("button", { name: "名刺を見る" }));
    expect(mockNavigate).toHaveBeenCalledWith("/cards/testuser");
  });

  it("IDを入力しないでボタンを押すとエラーメッセージが表示される", () => {
    renderTopPage();
    fireEvent.click(screen.getByRole("button", { name: "名刺を見る" }));
    expect(screen.getByText("IDを入力してください")).toBeInTheDocument();
  });

  it("新規登録はこちらを押すと/cards/registerに遷移する", () => {
    renderTopPage();

    expect(
      screen.getByRole("link", { name: "新規登録はこちら" }),
    ).toHaveAttribute("href", "/cards/register");
  });
});
