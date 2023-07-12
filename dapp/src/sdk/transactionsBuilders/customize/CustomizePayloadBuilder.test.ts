import { Address } from '@multiversx/sdk-core/out';
import CustomizePayloadBuilder, { ERR_PENGUIN_NONCE_MUST_BE_POSITIVE, ERR_PENGUIN_COLLECTION_UNDEFINED, ERR_CUSTOMIZATION_SC_ADDRESS_UNSET, ERR_NO_ITEMS_SET } from './CustomizePayloadBuilder';

// documentation about customize tx: https://github.com/Angry-Penguins-Colony/sc-customize-nft

const customizationContractAddress = Address.fromBech32('erd1qqqqqqqqqqqqqpgqrc4pg2xarca9z34njcxeur622qmfjp8w2jps89fxnl');

describe('build() works with', () => {
    it('equipping one item', () => {
        const payload = new CustomizePayloadBuilder()
            .setPenguinCollection('APC-a1a1a1')
            .setPenguinNonce(10)
            .setCustomizationContractAddress(customizationContractAddress)
            .setItemsToEquip([{ collection: 'WEAPON-b2b2b2', nonce: 16 }])
            .build();

        expect(payload.toString())
            .toEqual(
                'MultiESDTNFTTransfer' +
                '@000000000000000005001e2a1428dd1e3a5146b3960d9e0f4a50369904ee5483' +
                '@02' +
                '@4150432d613161316131' +
                '@0a' + // nonce
                '@01' + // quantity to send
                '@574541504f4e2d623262326232' +
                '@10' + // nonce 16
                '@01' +
                '@637573746f6d697a65'
            );
    });

    it('desequipping one item', () => {
        const payload = new CustomizePayloadBuilder()
            .setPenguinCollection('APC-a1a1a1')
            .setPenguinNonce(1)
            .setCustomizationContractAddress(customizationContractAddress)
            .setSlotsToUnequip(['hat'])
            .build();

        expect(payload.toString())
            .toEqual(
                'MultiESDTNFTTransfer' +
                '@000000000000000005001e2a1428dd1e3a5146b3960d9e0f4a50369904ee5483' +
                '@01' +
                '@4150432d613161316131' +
                '@01' + // nonce
                '@01' + // quantity to send
                '@637573746f6d697a65' +
                '@686174' // hat
            );
    });

    it('equipping an item and desequipping another item', () => {
        const payload = new CustomizePayloadBuilder()
            .setPenguinCollection('APC-a1a1a1')
            .setPenguinNonce(10)
            .setCustomizationContractAddress(customizationContractAddress)
            .setItemsToEquip([{ collection: 'WEAPON-b2b2b2', nonce: 10 }])
            .setSlotsToUnequip(['hat'])
            .build();

        expect(payload.toString())
            .toEqual(
                'MultiESDTNFTTransfer' +
                '@000000000000000005001e2a1428dd1e3a5146b3960d9e0f4a50369904ee5483' +
                '@02' +
                '@4150432d613161316131' +
                '@0a' + // nonce
                '@01' + // quantity to send
                '@574541504f4e2d623262326232' +
                '@0a' + // nonce 10
                '@01' +
                '@637573746f6d697a65' +
                '@686174' // hat
            );
    });
});

describe('build() throw error', () => {
    describe('when penguin nonce', () => {
        it('is negative', () => {
            const builder = new CustomizePayloadBuilder()
                .setCustomizationContractAddress(Address.fromBech32('erd1c0hhz2xcnsdk6630um7k8jrg2k8zvvpwf39e83xsg8mq68rsettqzdhhjq'))
                .setPenguinCollection('APC-a1a1a1')
                .setPenguinNonce(-1);

            expect(() => builder.build())
                .toThrowError(ERR_PENGUIN_NONCE_MUST_BE_POSITIVE);
        });

        it('is equals to zero', () => {
            const builder = new CustomizePayloadBuilder()
                .setCustomizationContractAddress(Address.fromBech32('erd1c0hhz2xcnsdk6630um7k8jrg2k8zvvpwf39e83xsg8mq68rsettqzdhhjq'))
                .setPenguinCollection('APC-a1a1a1')
                .setPenguinNonce(0);

            expect(() => builder.build())
                .toThrowError(ERR_PENGUIN_NONCE_MUST_BE_POSITIVE);
        });

        it('is unset', () => {
            const builder = new CustomizePayloadBuilder()
                .setCustomizationContractAddress(Address.fromBech32('erd1c0hhz2xcnsdk6630um7k8jrg2k8zvvpwf39e83xsg8mq68rsettqzdhhjq'))
                .setPenguinCollection('APC-a1a1a1')
                .setPenguinNonce(0);

            expect(() => builder.build())
                .toThrowError(ERR_PENGUIN_NONCE_MUST_BE_POSITIVE);
        });
    });

    describe('when penguinIdentifier', () => {
        it('is unset', () => {
            const builder = new CustomizePayloadBuilder()
                .setCustomizationContractAddress(Address.fromBech32('erd1c0hhz2xcnsdk6630um7k8jrg2k8zvvpwf39e83xsg8mq68rsettqzdhhjq'))
                .setPenguinNonce(1);

            expect(() => builder.build())
                .toThrowError(ERR_PENGUIN_COLLECTION_UNDEFINED);
        });
    });

    describe('when customizationContractAddress', () => {
        it('is unset', () => {
            const builder = new CustomizePayloadBuilder()
                .setPenguinCollection('APC-a1a1a1')
                .setPenguinNonce(1);

            expect(() => builder.build())
                .toThrowError(ERR_CUSTOMIZATION_SC_ADDRESS_UNSET);
        });
    });

    describe('when both equipToItems and itemsToUnequip ', () => {

        it('are unset', () => {
            const builder = new CustomizePayloadBuilder()
                .setCustomizationContractAddress(Address.fromBech32('erd1c0hhz2xcnsdk6630um7k8jrg2k8zvvpwf39e83xsg8mq68rsettqzdhhjq'))
                .setPenguinCollection('APC-a1a1a1')
                .setPenguinNonce(1);

            expect(() => builder.build())
                .toThrowError(ERR_NO_ITEMS_SET);
        })

        it('are empty', () => {
            const builder = new CustomizePayloadBuilder()
                .setCustomizationContractAddress(Address.fromBech32('erd1c0hhz2xcnsdk6630um7k8jrg2k8zvvpwf39e83xsg8mq68rsettqzdhhjq'))
                .setPenguinCollection('APC-a1a1a1')
                .setPenguinNonce(1)
                .setItemsToEquip([]);


            expect(() => builder.build())
                .toThrowError(ERR_NO_ITEMS_SET);
        })
    })
});
