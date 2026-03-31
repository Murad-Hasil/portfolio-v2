import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import NotFound from "@/app/not-found";

describe("NotFound page", () => {
  it("renders 404 heading", () => {
    render(<NotFound />);
    expect(screen.getByText("Page Not Found")).toBeInTheDocument();
  });

  it("renders Return Home link pointing to /", () => {
    render(<NotFound />);
    const link = screen.getByRole("link", { name: /return home/i });
    expect(link).toHaveAttribute("href", "/");
  });

  it("shows // 404 label", () => {
    render(<NotFound />);
    expect(screen.getByText("// 404")).toBeInTheDocument();
  });
});
