import { describe, expect, it } from "vitest";
import { slugify } from "./slug";

describe("slugify", () => {
  it("normaliza acentos, espaços e pontuação", () => {
    expect(slugify("  O Céu, depois!  ")).toBe("o-ceu-depois");
  });

  it("limita o slug a 80 caracteres", () => {
    expect(slugify("a".repeat(100))).toHaveLength(80);
  });
});
