import { Address } from '@elrondnetwork/erdjs/out';
import { devnetToolDeploy } from 'devnet.tool-result';
import APCLogger, { LogType } from 'logger';

const useDevnet = process.env.REACT_APP_DEVNET == '1';

if (useDevnet) {
  console.log('Using devnet');
}

const logFlags = process.env.REACT_APP_MUTED_LOG?.split(' ') ?? [];
console.log('Muted logs', logFlags);
export const apcLogger = new APCLogger(logFlags as LogType[]);

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
      customisationContractAddress: Address.fromBech32(devnetToolDeploy.customizationContractAddress.bech32),
      penguinCollection: devnetToolDeploy.penguinsIdentifier,
      marketplaceContractAddress: Address.fromBech32('erd1qqqqqqqqqqqqqpgq7dpna9wwv2yn5ukqlwgv3s0zmaxwnexpv4xq56xty9'),
      items: devnetToolDeploy.items
    }
  }
  else {
    throw new Error('Not implemented');
  }
}

export const marketplaceApi = getNetworkInfos().api;
export const customisationContractAddress = getNetworkInfos().customisationContractAddress;
export const penguinCollection = getNetworkInfos().penguinCollection;
export const marketplaceContractAddress = getNetworkInfos().marketplaceContractAddress;
export const items = getNetworkInfos().items;