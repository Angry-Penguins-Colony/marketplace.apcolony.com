import RenderAttributes, { ERR_BAD_FORMAT, ERR_EMPTY_SLOT_KEY, ERR_EMPTY_SLOT_VALUE } from "./RenderAttributes";

test("getItemsBySlot", () => {
    const actual = new RenderAttributes(
        new Map<string, string>([["slot1", "item1"], ["slot2", "item2"]]),
        ["layer1", "layer2"]
    ).getItemsBySlot();

    const expected = [["slot1", "item1"], ["slot2", "item2"]];

    expect(actual).toStrictEqual(expected);
})

describe("fromAttributes", () => {
    it("parse empty element", () => {
        expect(RenderAttributes.fromAttributes("", []))
            .toStrictEqual(new RenderAttributes([], []));
    });

    it("parse one element", () => {
        expect(RenderAttributes.fromAttributes("Hat:Cap", []))
            .toStrictEqual(new RenderAttributes([
                ["Hat", "Cap"]
            ], []));
    });

    it("parse two element", () => {
        expect(RenderAttributes.fromAttributes("Hat:Cap;Clothes:T-Shirt", []))
            .toStrictEqual(new RenderAttributes([
                ["Hat", "Cap"],
                ["Clothes", "T-Shirt"]
            ], []));
    });

    describe("throw errors", () => {

        it("throw error if too much :", () => {
            expect(() => RenderAttributes.fromAttributes("Hat:Pirate:Chapka", []))
                .toThrowError(ERR_BAD_FORMAT);
        });

        it("throw error if no kvp", () => {
            expect(() => RenderAttributes.fromAttributes("Hat-Cap", []))
                .toThrowError(ERR_BAD_FORMAT);
        });

        it("throw error if trailing semicolon", () => {
            expect(() => RenderAttributes.fromAttributes("Hat:Cap;", []))
                .toThrowError(ERR_BAD_FORMAT);
        });

        it("throw error if empty slot key", () => {
            expect(() => RenderAttributes.fromAttributes(":Cap", []))
                .toThrowError(ERR_EMPTY_SLOT_KEY);
        });

        it("throw error if empty slot value", () => {
            expect(() => RenderAttributes.fromAttributes("Hat:", []))
                .toThrowError(ERR_EMPTY_SLOT_VALUE);
        });
    })
});