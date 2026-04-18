import { describe, it, expect } from "vitest";
import { validate } from "../public/js/commision.js";


describe("Commission Validation", () => {

  const base = {
    phone: "123",
    country: "SA",
    city: "Jeddah",
    gift: false,
    message: ""
  }



  it("C1 empty phone", () => {


  expect(validate(base)).toBe(true)


  const test = { ...base, phone: "" }

  expect(validate(test)).toBe(false)

  })



  it("C2 empty country", () =>{

    expect(validate(base)).toBe(true)

    const test = { ...base, country: ""}

    expect(validate(test)).toBe(false)

  })




it("C3 empty city ", () => {

  expect(validate(base)).toBe(true)

  const test = { ...base, city: "" }

  expect(validate(test)).toBe(false)
});



it("C4 empty gift ", () => {

 
  expect(validate({ ...base, gift: false })).toBe(true)

  
  expect(validate({ ...base, gift: true })).toBe(false)

})


it("C5 empty message ", () => {

  const giftBase = { ...base, gift: true, message: "msg" }


  expect(validate(giftBase)).toBe(true)


  expect(validate({ ...giftBase, message: "" })).toBe(false)

})





})