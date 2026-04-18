import { describe, it, expect } from "vitest"

// TEST CASES FOR EDGE COV
describe("GET /cart/:userId", () => {

  it("should return 404 if user not found", async () => {

    const userId = "507f1f77bcf86cd799439011"

    const res = await fetch(`http://localhost:3000/cart/${userId}`)
    const data = await res.json()

    expect(res.status).toBe(500)
    expect(data.message).toBe("User not found")

  })

  //SECO T
  //TH T
  //FOU T
  //FIV T

})


//TESR CASES FOR PRIME COV
describe("GET /cart/:userId", () => {

  
  //FIRS T
  //SECO T
  //TH T
  //FOU T
  //FIV T

})