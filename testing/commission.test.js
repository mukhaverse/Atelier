import { describe, it, expect } from "vitest";
import { hasInvalidFields  } from "../public/js/commision.js";



describe("logic with ACC", () => {

  const baseFields = [
    { value: "123" },
    { value: "SA" },
    { value: "Jeddah" }
  ]


  it("C1 determines predicate outcome ", () => {
    expect(hasInvalidFields(baseFields)).toBe(false);


    const test = [
      { value: "" },
      { value: "SA" },
      { value: "Jeddah" }
    ]

    expect(hasInvalidFields(test)).toBe(true)

  })


  

  it("C2 determines predicate outcome ", () => {

    expect(hasInvalidFields(baseFields)).toBe(false)

    const test = [
      { value: "123" },
      { value: "" },
      { value: "Jeddah" }
    ]

    expect(hasInvalidFields(test)).toBe(true);
  })


  

  it("C3 determines predicate outcome ", () => {

    expect(hasInvalidFields(baseFields)).toBe(false)

    const test = [
      { value: "123" },
      { value: "SA" },
      { value: "" }
    ]

    expect(hasInvalidFields(test)).toBe(true)
  })


  it("Multiple invalid fields still result in predicate being true", () => {

    const test = [
      { value: "" },
      { value: "" },
      { value: "Jeddah" }
    ]

    expect(hasInvalidFields(test)).toBe(true)

  })



})






describe("input space ecc", () => {

  it("TC1 number value", () => {
    expect(() => hasInvalidFields([
      { value: 123 },
      { value: "Valid" },
      { value: "Valid" }
    ])).toThrow()
  })

  it("TC2 special characters", () => {
    expect(hasInvalidFields([
      { value: "@#$%" },
      { value: "Valid" },
      { value: "Valid" }
    ])).toBe(false)
  })

  it("TC3 long string", () => {
    expect(hasInvalidFields([
      { value: "a".repeat(1000) },
      { value: "Valid" },
      { value: "Valid" }
    ])).toBe(false)
  })

  it("TC4 missing value property", () => {
    expect(hasInvalidFields([
    {},
    { value: "Valid" },
    { value: "Valid" }
    ])).toBe(true)
  })

  it("TC5 fewer fields", () => {
    expect(hasInvalidFields([
      { value: "Valid" }
    ])).toBe(false)
  })

})


describe("input space pairwise", () => {

  it("TC6 number with whitespace", () => {
    expect(() => hasInvalidFields([
      { value: 123 },
      { value: "   " },
      { value: "Valid" }
    ])).toThrow()
  })

  it("TC7 missing value with null", () => {
    expect(hasInvalidFields([
    {},
    { value: null },
    { value: "Valid" }
    ])).toBe(true)
  })

  it("TC8 long string with undefined", () => {
    expect(hasInvalidFields([
    { value: "a".repeat(1000) },
    { value: undefined },
    { value: "Valid" }
    ])).toBe(true)
  })

  it("TC9 fewer fields with invalid", () => {
    expect(hasInvalidFields([
      { value: "" }
    ])).toBe(true)
  })


})