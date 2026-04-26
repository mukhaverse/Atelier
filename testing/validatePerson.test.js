import { describe, it, expect } from "vitest";
import { validatePersonLogic } from "../public/js/commision.js";

describe("Clause Coverage", () => {

  it("TC1 phone is null", () => {
    expect(validatePersonLogic(null, "Saudi", "Jeddah")).toBe(false);
  });


  it("TC2 phone is blank", () => {
    expect(validatePersonLogic("   ", "Saudi", "Jeddah")).toBe(false);
  });


  it("TC3 country is blank", () => {
    expect(validatePersonLogic("1234567890", "   ", "Jeddah")).toBe(false);
  });


  it("TC4 city is blank", () => {
    expect(validatePersonLogic("1234567890", "Saudi", "   ")).toBe(false);
  });


  it("TC5 phone format is invalid", () => {
    expect(validatePersonLogic("abc", "Saudi", "Jeddah")).toBe(false);
  });


  it("TC6 all inputs valid", () => {
    expect(validatePersonLogic("1234567890", "Saudi", "Jeddah")).toBe(true);
  });

});



describe("ACC P1", () => {
  it("TC1 C1 active: phone is null", () => {
    expect(validatePersonLogic(null, "Saudi", "Jeddah")).toBe(false);
  });

  it("TC2 baseline valid", () => {
    expect(validatePersonLogic("1234567890", "Saudi", "Jeddah")).toBe(true);
  });

  it("TC3 C2 active: phone is blank", () => {
    expect(validatePersonLogic("   ", "Saudi", "Jeddah")).toBe(false);
  });

  it("TC4 baseline valid", () => {
    expect(validatePersonLogic("1234567890", "Saudi", "Jeddah")).toBe(true);
  });
});



describe("ACC P2", () => {
  it("TC1 country is null", () => {
    expect(validatePersonLogic("1234567890", null, "Jeddah")).toBe(false);
  });

  it("TC2 baseline valid", () => {
    expect(validatePersonLogic("1234567890", "Saudi", "Jeddah")).toBe(true);
  });

  it("TC3 country is blank", () => {
    expect(validatePersonLogic("1234567890", "   ", "Jeddah")).toBe(false);
  });

  it("TC4 baseline valid", () => {
    expect(validatePersonLogic("1234567890", "Saudi", "Jeddah")).toBe(true);
  });
});



describe("ACC P3", () => {
  it("TC1 city is null", () => {
    expect(validatePersonLogic("1234567890", "Saudi", null)).toBe(false);
  });

  it("TC2 baseline valid", () => {
    expect(validatePersonLogic("1234567890", "Saudi", "Jeddah")).toBe(true);
  });

  it("TC3 city is blank", () => {
    expect(validatePersonLogic("1234567890", "Saudi", "   ")).toBe(false);
  });

  it("TC4 baseline valid", () => {
    expect(validatePersonLogic("1234567890", "Saudi", "Jeddah")).toBe(true);
  });
});




describe("ACC P4", () => {
  it("TC1 invalid phone format", () => {
    expect(validatePersonLogic("abc", "Saudi", "Jeddah")).toBe(false);
  });

  it("TC2 valid phone format", () => {
    expect(validatePersonLogic("1234567890", "Saudi", "Jeddah")).toBe(true);
  });
});