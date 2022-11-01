import { extractCIDFromIPFS, getIdFromPenguinName, splitCollectionAndNonce } from "./string";

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

describe("splitCollectionAndNonce", () => {

    it("parse dec", () => {
        expect(splitCollectionAndNonce("HAT-a1a1a1-02"))
            .toEqual({
                collection: "HAT-a1a1a1",
                nonce: 2
            });
    });

    it("parse hex", () => {

        expect(splitCollectionAndNonce("HAT-a1a1a1-0a"))
            .toEqual({
                collection: "HAT-a1a1a1",
                nonce: 10
            });
    });
})