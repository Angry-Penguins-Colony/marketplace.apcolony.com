import { extractCIDFromIPFS, getIdFromPenguinName } from "./string";

it("extractCIDFromIPFS", () => {
    expect(extractCIDFromIPFS("https://ipfs.io/ipfs/cid/")).toBe("cid");
    expect(extractCIDFromIPFS("https://ipfs.io/ipfs/cid")).toBe("cid");
});

describe("getIdFromPenguinName", () => {
    it("parse id", () => {

        expect(getIdFromPenguinName("Penguin #1"))
            .toBe(1);
        expect(getIdFromPenguinName("Penguin #2"))
            .toBe(2);
    })

    it("throw error when missing #", () => {
        expect(() => getIdFromPenguinName("Penguin 2"))
            .toThrowError("Invalid name Penguin 2");

    });

    it("throw error when id is not a number", () => {
        expect(() => getIdFromPenguinName("Penguin #a"))
            .toThrowError("Invalid name Penguin #a");
    });
});