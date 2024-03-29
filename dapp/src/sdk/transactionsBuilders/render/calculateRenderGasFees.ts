import { TransactionPayload } from '@multiversx/sdk-core/out';

export default function calculeRenderGasFees(data: TransactionPayload) {
    return 50_000_000 + 1500 * data.length();
}