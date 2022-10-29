import "jest";
import { isCID, sortImages, capitalize } from "./utils";

import { getOccurences } from "./utils";

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


describe("getOccurences", () => {
    /*
    https://gist.github.com/victornpb/7736865
    http://stackoverflow.com/questions/4009756/how-to-count-string-occurrence-in-string/7924240#7924240
  */

    test("empty substring", function () {
        expect(getOccurences("", "")).toBe(1);
        expect(getOccurences("abc", "")).toBe(4);
    });

    test("single occurences", function () {
        expect(getOccurences("foo", "foo")).toBe(1);
        expect(getOccurences("blahfooblah", "foo")).toBe(1);
        expect(getOccurences("foo", "f")).toBe(1);
    });

    test("multiple getOccurences", function () {
        expect(getOccurences("foofoofoofoo", "foo")).toBe(4);
        expect(getOccurences("foofoofoofoo", "foofoo")).toBe(2);
        expect(getOccurences("blafooblahfooblah", "foo")).toBe(2);
        expect(getOccurences("foofoofooooofo", "foo")).toBe(3);
    });

    test("no getOccurences", function () {
        expect(getOccurences("", "foo")).toBe(0);
        expect(getOccurences("abc", "foo")).toBe(0);
        expect(getOccurences("boo", "foo")).toBe(0);
    });

    test("overlap", function () {
        expect(getOccurences("", "", true)).toBe(1);
        expect(getOccurences("abc", "", true)).toBe(4);
        expect(getOccurences("foofoofoofoo", "foofoo", true)).toBe(3);
        expect(getOccurences("blafooblahfooblah", "foo", true)).toBe(2);
        expect(getOccurences("foofoofooooofo", "foo", true)).toBe(3);
    });

    test("overlap no getOccurences", function () {
        expect(getOccurences("", "foo", true)).toBe(0);
        expect(getOccurences("abc", "foo", true)).toBe(0);
        expect(getOccurences("boo", "foo", true)).toBe(0);
        expect(getOccurences("fooofooofooofoo", "foofoo", true)).toBe(0);
        expect(getOccurences("blafobooblahfoboblah", "foo", true)).toBe(0);
        expect(getOccurences("fofofofaooooofo", "foo", true)).toBe(0);
    });

})