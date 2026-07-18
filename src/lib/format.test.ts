import { describe, expect, it } from "vitest";
import { excerpt, parseFormattedText } from "./format";

describe("parseFormattedText", () => {
  it("identifica texto entre asteriscos como negrito", () => {
    expect(parseFormattedText("Eu *superei esse desejo* hoje.")).toEqual([
      { text: "Eu ", bold: false },
      { text: "superei esse desejo", bold: true },
      { text: " hoje.", bold: false },
    ]);
  });

  it("mantém asterisco sem fechamento como texto comum", () => {
    expect(parseFormattedText("Um *trecho incompleto")).toEqual([
      { text: "Um *trecho incompleto", bold: false },
    ]);
  });
});

describe("excerpt", () => {
  it("remove os marcadores de negrito do resumo", () => {
    expect(excerpt("Eu *superei esse desejo* hoje.")).toBe("Eu superei esse desejo hoje.");
  });
});
