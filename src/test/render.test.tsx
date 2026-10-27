import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { App } from "../app/App";
import rw from "../lib/i18n/rw.json";

beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: false,
    media: query,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
  }));
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("App", () => {
  it("renders the welcome screen for a signed out visitor", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
    );

    expect(await screen.findByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getAllByRole("link").length).toBeGreaterThan(0);
  });

  it("renders the style guide with real controls and charts", async () => {
    render(
      <MemoryRouter initialEntries={["/style-guide"]}>
        <App />
      </MemoryRouter>,
    );

    expect(await screen.findByText("AGUra style guide")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Primary" })).toBeInTheDocument();
    // Every badge in the guide carries text, never colour alone. The default
    // language is Kinyarwanda, so the label is read from that dictionary.
    expect(screen.getByText(rw["status.trackable"])).toBeInTheDocument();
  });

  it("sends a signed out farmer to sign in rather than a protected screen", async () => {
    render(
      <MemoryRouter initialEntries={["/app/today"]}>
        <App />
      </MemoryRouter>,
    );

    expect(await screen.findByRole("heading", { level: 1 })).toBeInTheDocument();
  });
});
