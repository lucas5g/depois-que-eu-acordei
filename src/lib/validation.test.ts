import { describe, expect, it } from "vitest";
import { dreamSchema } from "./validation";

describe("dreamSchema", () => {
  it("aceita um sonho válido", () => {
    expect(
      dreamSchema.safeParse({
        title: "Uma casa azul",
        description: "Eu caminhava por uma casa que não terminava.",
        imageAlt: "Casa azul sob um céu escuro",
        status: "PUBLISHED",
      }).success,
    ).toBe(true);
  });

  it("rejeita conteúdo curto e status desconhecido", () => {
    expect(
      dreamSchema.safeParse({
        title: "Oi",
        description: "Curto",
        imageAlt: "x",
        status: "HIDDEN",
      }).success,
    ).toBe(false);
  });
});
