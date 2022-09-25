import { Attributes } from '@apcolony/marketplace-api';
import { ArgSerializer, BytesValue, TransactionPayload } from '@elrondnetwork/erdjs/out';

export class RenderPayloadBuilder {
    public attributes?: Attributes;

    public setAttributes(attributes: Attributes) {
        this.attributes = attributes;
        return this;
    }

    public build(): TransactionPayload {

        if (!this.attributes) throw new Error('Attributes are required');

        const args = [
            BytesValue.fromUTF8(this.attributes.toEndpointArgument()),
        ];

        const { argumentsString } = new ArgSerializer().valuesToString(args);
        const data = 'renderImage@' + argumentsString;

        return new TransactionPayload(data);
    }
}