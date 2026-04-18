import { describe, it, expect } from "vitest";
import { hasInvalidFields  } from "../public/js/commision.js";



describe("order summary validation ", () => {

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