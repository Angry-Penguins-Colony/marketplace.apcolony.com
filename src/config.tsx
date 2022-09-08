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

export const ipfsGateway = 'https://ipfs.io/ipfs/';

export const defaultImages = {
  'background': ipfsGateway + 'QmasaaTYGqaLhuhqMTxr2FzbgTY2cr9azafhQiJHrQ6usy',
  'beak': ipfsGateway + 'Qmamqckr2cpqfXGfDroDZTY61k9by2tYAsw1HeBKEcAg8n',
  'eyes': ipfsGateway + 'QmaapjJRWBzUvgGfJLdkFtjdBRZCvyPkv7oSM9xxbehDJq',
  'skin': ipfsGateway + 'QmdBbSbwW9Ho7Yk2sKLnV8bbvrwLzJfhLUejQpH7CvGkik',
};