import { describe, expect, it } from "vitest";
import { excerpt, parseFormattedText, socialImageUrl } from "./format";

describe("parseFormattedText", () => {
  it("identifica texto entre asteriscos como negrito", () => {
    expect(parseFormattedText("Eu **superei esse desejo** hoje.")).toEqual([
      { text: "Eu ", bold: false },
      { text: "superei esse desejo", bold: true },
      { text: " hoje.", bold: false },
    ]);
  });

  it("mantém a marcação incompleta como texto comum", () => {
    expect(parseFormattedText("Um **trecho incompleto")).toEqual([
      { text: "Um **trecho incompleto", bold: false },
    ]);
  });

  it("interpreta asteriscos simples como negrito", () => {
    expect(parseFormattedText("Um *trecho comum*")).toEqual([
      { text: "Um ", bold: false },
      { text: "trecho comum", bold: true },
    ]);
  });
});

describe("excerpt", () => {
  it("remove os marcadores de negrito do resumo", () => {
    expect(excerpt("Eu **superei esse desejo** hoje.")).toBe("Eu superei esse desejo hoje.");
    expect(excerpt("Eu *superei esse desejo* hoje.")).toBe("Eu superei esse desejo hoje.");
  });
});

describe("socialImageUrl", () => {
  it("gera uma URL JPEG versionada sem parâmetros", () => {
    expect(socialImageUrl("relato-1", new Date("2026-07-18T20:00:00Z"))).toBe(
      "/images/relato-1/social-v2-1784404800000.jpg",
    );
  });
});
