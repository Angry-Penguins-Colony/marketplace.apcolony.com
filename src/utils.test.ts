import { getOccurences } from "./utils";

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