import { MissingSlot, UnknownItem, UnknownSlot } from "../errors/configErrors";
import Config from "./config";

describe("allCIDs", () => {
    it("should return all cids", () => {

        const config = new Config({
            itemsCID: {
                "hat": {
                    "nest": "Qmb6GRsRAxMfUHo9es7p8D9PNQSpejmfM2pRPExxAYkKF8",
                    "cowboy": "QmY9fuMbpLoiG2T7VqyWJqhSsWkZukg9pN9oTCTXKHm4D1"
                },
                "eyes": {
                    "bitcoin": "QmePoBRS7KkVV4ZF4Pb2Sc1f2gKDe5ow2zsEC2ajWFvKoJ"
                },
            }
        });

        expect(config.allCIDs()).toEqual([
            "Qmb6GRsRAxMfUHo9es7p8D9PNQSpejmfM2pRPExxAYkKF8",
            "QmY9fuMbpLoiG2T7VqyWJqhSsWkZukg9pN9oTCTXKHm4D1",
            "QmePoBRS7KkVV4ZF4Pb2Sc1f2gKDe5ow2zsEC2ajWFvKoJ",
        ]);
    });

    it("should return empty cid", () => {
        const config = new Config({
            itemsCID: {}
        });

        expect(config.allCIDs()).toEqual([]);
    })
})

describe("misc ctor", () => {
    it("fallback layerOrder", () => {
        const t = new Config({
            itemsCID: {
                "hat": {
                    "nest": "Qmb6GRsRAxMfUHo9es7p8D9PNQSpejmfM2pRPExxAYkKF8",
                    "cowboy": "QmY9fuMbpLoiG2T7VqyWJqhSsWkZukg9pN9oTCTXKHm4D1"
                },
                "eyes": {
                    "bitcoin": "QmePoBRS7KkVV4ZF4Pb2Sc1f2gKDe5ow2zsEC2ajWFvKoJ"
                },
            }
        });

        expect(t.layersOrder).toEqual([
            "hat",
            "eyes",
        ]);
    })
})

describe("handle bad values in constructor", () => {
    it("throw error if layersOrder miss a slot", () => {
        const t = () => new Config({
            itemsCID: {
                "hat": {
                    "nest": "Qmb6GRsRAxMfUHo9es7p8D9PNQSpejmfM2pRPExxAYkKF8",
                    "cowboy": "QmY9fuMbpLoiG2T7VqyWJqhSsWkZukg9pN9oTCTXKHm4D1"
                },
                "eyes": {
                    "bitcoin": "QmePoBRS7KkVV4ZF4Pb2Sc1f2gKDe5ow2zsEC2ajWFvKoJ"
                },
            },
            layersOrder: ["hat"]
        });

        expect(t).toThrowError(MissingSlot);
    })

    it("throw error if layersOrders includes an unexisting slot", () => {
        const t = () => new Config({
            itemsCID: {
                "hat": {
                    "nest": "Qmb6GRsRAxMfUHo9es7p8D9PNQSpejmfM2pRPExxAYkKF8",
                    "cowboy": "QmY9fuMbpLoiG2T7VqyWJqhSsWkZukg9pN9oTCTXKHm4D1"
                },
                "eyes": {
                    "bitcoin": "QmePoBRS7KkVV4ZF4Pb2Sc1f2gKDe5ow2zsEC2ajWFvKoJ"
                },
            },
            layersOrder: ["hat", "blablabla"]
        });

        expect(t).toThrowError(UnknownSlot);
    });

    it("throw error if defaultLayer contains an unexisting slot", () => {
        const t = () => new Config({
            itemsCID: {
                "hat": {
                    "nest": "Qmb6GRsRAxMfUHo9es7p8D9PNQSpejmfM2pRPExxAYkKF8",
                    "cowboy": "QmY9fuMbpLoiG2T7VqyWJqhSsWkZukg9pN9oTCTXKHm4D1"
                },
                "eyes": {
                    "bitcoin": "QmePoBRS7KkVV4ZF4Pb2Sc1f2gKDe5ow2zsEC2ajWFvKoJ"
                },
            },
            defaultLayers: {
                "blablabla": "nest"
            }
        });


        expect(t).toThrowError(UnknownSlot);
    })

    it("throw error if defaultLayer contains an unexisting items", () => {
        const t = () => new Config({
            itemsCID: {
                "hat": {
                    "nest": "Qmb6GRsRAxMfUHo9es7p8D9PNQSpejmfM2pRPExxAYkKF8",
                    "cowboy": "QmY9fuMbpLoiG2T7VqyWJqhSsWkZukg9pN9oTCTXKHm4D1"
                },
                "eyes": {
                    "bitcoin": "QmePoBRS7KkVV4ZF4Pb2Sc1f2gKDe5ow2zsEC2ajWFvKoJ"
                },
            },
            defaultLayers: {
                "eyes": "blabla"
            }
        });

        expect(t).toThrowError(UnknownItem);
    });

    it("throw error if defaultLayer contains an item from another slot", () => {
        const t = () => new Config({
            itemsCID: {
                "hat": {
                    "nest": "Qmb6GRsRAxMfUHo9es7p8D9PNQSpejmfM2pRPExxAYkKF8",
                    "cowboy": "QmY9fuMbpLoiG2T7VqyWJqhSsWkZukg9pN9oTCTXKHm4D1"
                },
                "eyes": {
                    "bitcoin": "QmePoBRS7KkVV4ZF4Pb2Sc1f2gKDe5ow2zsEC2ajWFvKoJ"
                },
            },
            defaultLayers: {
                "eyes": "nest"
            }
        });

        expect(t).toThrowError(UnknownItem);
    });

    it("can set badge slot if there is no plugin", () => {
        const t = () => new Config({
            itemsCID: {
                "hat": {
                    "nest": "Qmb6GRsRAxMfUHo9es7p8D9PNQSpejmfM2pRPExxAYkKF8",
                    "cowboy": "QmY9fuMbpLoiG2T7VqyWJqhSsWkZukg9pN9oTCTXKHm4D1"
                },
                "eyes": {
                    "bitcoin": "QmePoBRS7KkVV4ZF4Pb2Sc1f2gKDe5ow2zsEC2ajWFvKoJ"
                },
                "badge": {
                    "black": "someCID"
                }
            },
        });

        expect(t).not.toThrowError();
    });
});