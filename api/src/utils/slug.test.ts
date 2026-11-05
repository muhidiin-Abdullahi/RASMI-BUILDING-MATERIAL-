import { describe, expect, it } from "vitest";
import { escapeRegex, normalizeSlug } from "./slug.js";

describe("slug utils", () => {
  it("normalizes slugs", () => {
    expect(normalizeSlug("  Hello World! ")).toBe("hello-world");
  });

  it("escapes regex characters", () => {
    expect(escapeRegex("a+b")).toBe("a\\+b");
  });
});
