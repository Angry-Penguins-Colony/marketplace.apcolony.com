import RenderAttributes, { ERR_BAD_FORMAT, ERR_EMPTY_SLOT_KEY, ERR_EMPTY_SLOT_VALUE } from "./RenderAttributes";

const itemsDatabase = [
    {
        id: "1",
        name: "Black Cap"
    },
    {
        id: "2",
        name: "Cap"
    },
    {
        id: "5",
        name: "T-Shirt"
    }
];

test("getItemsBySlot", () => {
    const actual = new RenderAttributes(
        new Map<string, string>([["slot1", "item1"], ["slot2", "item2"]]),
        ["layer1", "layer2"]
    ).getIdsBySlot();

    const expected = [["slot1", "item1"], ["slot2", "item2"]];

    expect(actual).toStrictEqual(expected);
})

describe("fromAttributes", () => {
    it("parse empty element", () => {
        expect(RenderAttributes.fromAttributes("", itemsDatabase, []))
            .toStrictEqual(new RenderAttributes([], []));
    });

    it("parse one element", () => {
        expect(RenderAttributes.fromAttributes("Hat:Black Cap", itemsDatabase, []))
            .toStrictEqual(new RenderAttributes([
                ["hat", "1"]
            ], []));
    });

    it("parse two element", () => {
        expect(RenderAttributes.fromAttributes("Hat:Cap;Clothes:T-Shirt", itemsDatabase, []))
            .toStrictEqual(new RenderAttributes([
                ["hat", "2"],
                ["clothes", "5"]
            ], []));
    });

    describe("throw errors", () => {

        it("throw error if too much :", () => {
            expect(() => RenderAttributes.fromAttributes("Hat:Pirate:Chapka", itemsDatabase, []))
                .toThrowError(ERR_BAD_FORMAT);
        });

        it("throw error if no kvp", () => {
            expect(() => RenderAttributes.fromAttributes("Hat-Cap", itemsDatabase, []))
                .toThrowError(ERR_BAD_FORMAT);
        });

        it("throw error if trailing semicolon", () => {
            expect(() => RenderAttributes.fromAttributes("Hat:Cap;", itemsDatabase, []))
                .toThrowError(ERR_BAD_FORMAT);
        });

        it("throw error if empty slot key", () => {
            expect(() => RenderAttributes.fromAttributes(":Cap", itemsDatabase, []))
                .toThrowError(ERR_EMPTY_SLOT_KEY);
        });

        it("throw error if empty slot value", () => {
            expect(() => RenderAttributes.fromAttributes("Hat:", itemsDatabase, []))
                .toThrowError(ERR_EMPTY_SLOT_VALUE);
        });
    })
});

describe("toAttributes", () => {
    it("empty", () => {
        expect(new RenderAttributes([], []).toAttributes([], []))
            .toBe("");
    });

    it("one equipped; one unequipped", () => {
        const actual = new RenderAttributes([
            ["hat", "1"]
        ], []).toAttributes(itemsDatabase, ["hat", "clothes"]);

        const expected = "Hat:Black Cap;Clothes:unequipped";

        expect(actual).toBe(expected);
    });

    it("one equipped; no slots specified", () => {
        const actual = new RenderAttributes([
            ["hat", "1"]
        ], []).toAttributes(itemsDatabase, ["hat"]);

        const expected = "Hat:Black Cap";

        expect(actual).toBe(expected);
    });
})