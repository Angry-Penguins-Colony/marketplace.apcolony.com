import "jest";
import { isCID, sortImages, capitalize } from "./utils";

test('sort images', () => {
    const layerOrder = [
        "background",
        "weapon",
        "skin",
        "badge",
        "clothes",
        "beak",
        "eyes",
        "hat"
    ];

    const unordered = [
        ["hat", "hat-classic"],
        ["background", "background-1"],
        ["beak", "beak-classic"],
        ["skin", "skin-original"],
        ["eyes", "eyes-classic"],
        ["badge", "badge-1"],
        ["clothes", "clothes-classic"],
        ["weapon", "weapon-classic"],
    ] as [string, string][];

    const ordered = [
        "background-1",
        "weapon-classic",
        "skin-original",
        "badge-1",
        "clothes-classic",
        "beak-classic",
        "eyes-classic",
        "hat-classic",
    ];

    const result = sortImages(unordered, layerOrder);

    expect(result.length).toBe(ordered.length);
    for (let i = 0; i < ordered.length; i++) {
        expect(result[i][1]).toBe(ordered[i]);
    }

    expect(result[0][0]).toBe("background");
    expect(result[1][0]).toBe("weapon");
    expect(result[2][0]).toBe("skin");
    expect(result[3][0]).toBe("badge");
    expect(result[4][0]).toBe("clothes");
    expect(result[5][0]).toBe("beak");
    expect(result[6][0]).toBe("eyes");
    expect(result[7][0]).toBe("hat");
});

test("isCid", () => {
    expect(isCID("")).toBe(false);
    expect(isCID("1234567890123456")).toBe(false);
    expect(isCID("QmRuQPTfFhzM2rXXXDFiFHBeVdfZNFg3WcF4ds3nDiMpsv")).toBe(true);
    expect(isCID("QmQyu1jfTbqnQ5MCdZ7iYUWx6h2KP4a922WZnboBuveqAa/badges-00001-render.png")).toBe(false)
});

test("capitalize", () => {
    expect(capitalize("hello")).toStrictEqual("Hello");
    expect(capitalize("hello world")).toStrictEqual("Hello World");
})

import { requestsPerMinutesToMinTime } from "./utils"

test("perMinutesToMinTime", () => {
    expect(requestsPerMinutesToMinTime(240)).toBe(250);
    expect(requestsPerMinutesToMinTime(30)).toBe(2000);
})