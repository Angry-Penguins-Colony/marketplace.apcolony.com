const useDevnet = process.env.REACT_APP_DEVNET == '1';

if (useDevnet) {
  console.log('Using devnet');
}

export const contractAddress =
  'erd1qqqqqqqqqqqqqpgquvt728n40ssd8n2qns9jrlqpwq2jc4rj4cysfuj3ad';

export const dAppName = 'Marketplace';
export const ifpsGateway = 'https://ipfs.io/ipfs/';

const devnetApi = 'https://apc-marketplace-api-devnet.herokuapp.com/';
const mainnetApi = 'https://apc-marketplace-api.herokuapp.com/';
export const marketplaceApi = useDevnet ? devnetApi : mainnetApi;