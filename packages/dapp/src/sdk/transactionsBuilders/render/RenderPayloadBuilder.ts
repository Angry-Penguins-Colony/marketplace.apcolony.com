import { Attributes } from '@apcolony/marketplace-api';
import { ArgSerializer, BytesValue, TransactionPayload } from '@elrondnetwork/erdjs/out';

export class RenderPayloadBuilder {
    public attributes?: Attributes;
    public name?: string;

    public setAttributes(attributes: Attributes) {
        this.attributes = attributes;
        return this;
    }

    public setName(name: string) {
        this.name = name;
        return this;
    }

    public build(): TransactionPayload {

        if (!this.attributes) throw new Error('Attributes are required');
        if (!this.name) throw new Error('Name is required');

        const args = [
            BytesValue.fromUTF8(this.attributes.toEndpointArgument()),
            BytesValue.fromUTF8(this.name)
        ];

        const { argumentsString } = new ArgSerializer().valuesToString(args);
        const data = 'renderImage@' + argumentsString;

        return new TransactionPayload(data);
    }
}