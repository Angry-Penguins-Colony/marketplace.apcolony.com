import { Address } from '@elrondnetwork/erdjs/out';

const useDevnet = process.env.REACT_APP_DEVNET == '1';

if (useDevnet) {
  console.log('Using devnet');
}


export const dAppName = 'Marketplace';
export const ipfsGateway = 'https://ipfs.io/ipfs/';

export const defaultImages = {
  'background': ipfsGateway + 'QmasaaTYGqaLhuhqMTxr2FzbgTY2cr9azafhQiJHrQ6usy',
  'beak': ipfsGateway + 'Qmamqckr2cpqfXGfDroDZTY61k9by2tYAsw1HeBKEcAg8n',
  'eyes': ipfsGateway + 'QmaapjJRWBzUvgGfJLdkFtjdBRZCvyPkv7oSM9xxbehDJq',
  'skin': ipfsGateway + 'QmdBbSbwW9Ho7Yk2sKLnV8bbvrwLzJfhLUejQpH7CvGkik',
};

function getNetworkInfos() {
  if (useDevnet) {
    return {
      api: 'https://apc-marketplace-api-devnet.herokuapp.com/',
      customisationContractAddress: Address.fromBech32('erd1qqqqqqqqqqqqqpgqfjaamjjx9988rh24t7kr08krctjzm4w5lx4sn0g5rw'),
      penguinCollection: 'APC-a1a1a1',
    }
  }
  else {
    const mainnetApi = 'https://apc-marketplace-api.herokuapp.com/';
    throw new Error('Not implemented');
  }
}

export const marketplaceApi = getNetworkInfos().api;
export const customisationContractAddress = getNetworkInfos().customisationContractAddress;
export const penguinCollection = getNetworkInfos().penguinCollection;