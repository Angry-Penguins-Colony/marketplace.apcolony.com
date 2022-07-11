import RenderAttributes from "./RenderAttributes";

test("getItemsBySlot", () => {
    const actual = new RenderAttributes(
        new Map<string, string>([["slot1", "item1"], ["slot2", "item2"]]),
        ["layer1", "layer2"]
    ).getItemsBySlot();

    const expected = [["slot1", "item1"], ["slot2", "item2"]];

    expect(actual).toStrictEqual(expected);
})