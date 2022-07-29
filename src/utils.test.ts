import { extractCIDFromIPFS } from "./utils";

it("extractCIDFromIPFS", () => {
    expect(extractCIDFromIPFS("https://ipfs.io/ipfs/cid/")).toBe("cid");
    expect(extractCIDFromIPFS("https://ipfs.io/ipfs/cid")).toBe("cid");
});