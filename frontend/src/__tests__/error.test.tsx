import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

// Mock useEffect to avoid React 19 + Vitest jsdom hook conflict
vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");
  return { ...actual, useEffect: vi.fn() };
});

import ErrorPage from "@/app/error";

describe("Error page", () => {
  const mockError = new globalThis.Error("Test error") as Error & { digest?: string };
  const mockReset = vi.fn();

  beforeEach(() => {
    mockReset.mockClear();
  });

  it("renders error heading", () => {
    render(<ErrorPage error={mockError} reset={mockReset} />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("renders Try Again button", () => {
    render(<ErrorPage error={mockError} reset={mockReset} />);
    expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
  });

  it("calls reset when Try Again is clicked", () => {
    render(<ErrorPage error={mockError} reset={mockReset} />);
    fireEvent.click(screen.getByRole("button", { name: /try again/i }));
    expect(mockReset).toHaveBeenCalledOnce();
  });

  it("renders Return Home link", () => {
    render(<ErrorPage error={mockError} reset={mockReset} />);
    const link = screen.getByRole("link", { name: /return home/i });
    expect(link).toHaveAttribute("href", "/");
  });
});
