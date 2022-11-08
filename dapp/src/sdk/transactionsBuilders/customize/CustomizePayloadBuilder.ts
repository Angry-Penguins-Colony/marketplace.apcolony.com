import { Address, AddressValue, ArgSerializer, BytesValue, TransactionPayload, TypedValue, U64Value } from '@elrondnetwork/erdjs/out';
import { BigNumber } from 'bignumber.js';

export interface ItemToken {
    collection: string;
    nonce: number;
}

export default class CustomizePayloadBuilder {

    public customizationContractAddress?: Address;
    public penguinCollection = '';
    public penguinNonce = -1;
    public itemsToEquip: ItemToken[] = [];
    public slotsToUnequip: string[] = [];

    setCustomizationContractAddress(address: Address): CustomizePayloadBuilder {
        this.customizationContractAddress = address;
        return this;
    }

    setPenguinCollection(collection: string): CustomizePayloadBuilder {
        this.penguinCollection = collection;
        return this;
    }

    setPenguinNonce(nonce: number): CustomizePayloadBuilder {
        this.penguinNonce = nonce;
        return this;
    }

    setItemsToEquip(items: ItemToken[]): CustomizePayloadBuilder {
        this.itemsToEquip = items;
        return this;
    }

    setSlotsToUnequip(slots: string[]): CustomizePayloadBuilder {
        this.slotsToUnequip = slots;
        return this;
    }

    build(): TransactionPayload {
        if (!this.customizationContractAddress) throw new Error(ERR_CUSTOMIZATION_SC_ADDRESS_UNSET);
        if (!this.penguinCollection) throw new Error(ERR_PENGUIN_COLLECTION_UNDEFINED);
        if (this.penguinNonce <= 0) throw new Error(ERR_PENGUIN_NONCE_MUST_BE_POSITIVE);
        if (this.itemsToEquip.length == 0 && this.slotsToUnequip.length == 0) throw new Error(ERR_NO_ITEMS_SET);

        const itemsToEquipValue = this.itemsToEquip.map(item => {
            return [
                BytesValue.fromUTF8(item.collection),
                new U64Value(new BigNumber(item.nonce)),
                new U64Value(new BigNumber(1)), // we send only one item
            ];
        }).flat();

        const slotsToUnequipValue = this.slotsToUnequip
            .map(slot => BytesValue.fromUTF8(slot))

        const tokensAmountToSend = new U64Value(new BigNumber(1 + this.itemsToEquip.length));

        const args: TypedValue[] = [
            new AddressValue(this.customizationContractAddress), // receiver
            tokensAmountToSend,
            BytesValue.fromUTF8(this.penguinCollection),
            new U64Value(new BigNumber(this.penguinNonce)),
            new U64Value(new BigNumber(1)),
            ...itemsToEquipValue,
            BytesValue.fromUTF8('customize'),
            ...slotsToUnequipValue
        ];

        const { argumentsString } = new ArgSerializer().valuesToString(args);
        const data = 'MultiESDTNFTTransfer@' + argumentsString;

        return new TransactionPayload(data);
    }

    gesGasLimit(): number {
        return 20_000_000 + (this.itemsToEquip.length + this.slotsToUnequip.length) * 8_000_000;
    }
}

export const ERR_PENGUIN_NONCE_MUST_BE_POSITIVE = 'Penguin nonce must be positive';
export const ERR_PENGUIN_COLLECTION_UNDEFINED = 'Penguin collection is not set';
export const ERR_CUSTOMIZATION_SC_ADDRESS_UNSET = 'Customization contract address is not set';
export const ERR_NO_ITEMS_SET = 'No items to equip or unequip'