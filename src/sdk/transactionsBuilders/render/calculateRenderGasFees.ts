import { TransactionPayload } from '@elrondnetwork/erdjs/out';

export default function calculeRenderGasFees(data: TransactionPayload) {
    return 10_000_000 + 1500 * data.length();
}