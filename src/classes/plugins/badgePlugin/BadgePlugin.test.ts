import Config from "../../classes/config";
import { MissingSlot } from "../../errors/configErrors";
import BadgePlugin from "./BadgePlugin";
import { CannotSetBadgeInDefaultLayers, CannotUseBadgeAsSlotName } from "./errors";

describe("handle bad values in constructor", () => {
    it("throw error if useBadge is enabled and a slot named 'badge' is specified", () => {

        const t = () => new Config(
            {
                itemsCID: {
                    "badge": {
                        "nest": "Qmb6GRsRAxMfUHo9es7p8D9PNQSpejmfM2pRPExxAYkKF8",
                        "cowboy": "QmY9fuMbpLoiG2T7VqyWJqhSsWkZukg9pN9oTCTXKHm4D1"
                    },
                },
            },
            [
                new BadgePlugin({})
            ]
        );

        expect(t).toThrowError(CannotUseBadgeAsSlotName);
    })

    it("throw error if layersOrder miss badge slot", () => {
        const t = () => new Config(
            {
                itemsCID: {
                    "hat": {
                        "nest": "Qmb6GRsRAxMfUHo9es7p8D9PNQSpejmfM2pRPExxAYkKF8",
                        "cowboy": "QmY9fuMbpLoiG2T7VqyWJqhSsWkZukg9pN9oTCTXKHm4D1"
                    },
                    "eyes": {
                        "bitcoin": "QmePoBRS7KkVV4ZF4Pb2Sc1f2gKDe5ow2zsEC2ajWFvKoJ"
                    },
                },
                layersOrder: ["hat", "eyes"]
            },
            [
                new BadgePlugin({})
            ]
        );

        expect(t).toThrowError(MissingSlot);
    })

    it("throw error if useBadge is enabled and a slot named 'badge' is specified", () => {

        const t = () => new Config(
            {
                itemsCID: {
                    "badge": {
                        "nest": "Qmb6GRsRAxMfUHo9es7p8D9PNQSpejmfM2pRPExxAYkKF8",
                        "cowboy": "QmY9fuMbpLoiG2T7VqyWJqhSsWkZukg9pN9oTCTXKHm4D1"
                    },
                }
            },
            [
                new BadgePlugin({})
            ]
        );

        expect(t).toThrowError(CannotUseBadgeAsSlotName);
    })

    it("throw error if defaultLayer contains a badge", () => {
        const t = () => new Config(
            {
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
                    "badge": "nest"
                }
            },
            [
                new BadgePlugin({})
            ]
        );

        expect(t).toThrowError(CannotSetBadgeInDefaultLayers);
    });
})