import { describe, expect, it } from "vitest";
import { dreamSchema } from "./validation";

describe("dreamSchema", () => {
  it("aceita um relato válido", () => {
    expect(
      dreamSchema.safeParse({
        title: "Uma escolha difícil",
        description: "Senti uma vontade intensa, mas escolhi não agir sobre ela.",
        imageAlt: "Estrada vazia sob um céu escuro",
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
