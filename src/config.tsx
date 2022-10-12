import { Address } from '@elrondnetwork/erdjs/out';
import { devnetToolDeploy } from 'devnet.tool-result';
import APCLogger, { LogType } from 'logger';
import Explorer from 'sdk/classes/Explorer';

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
  'background': ipfsGateway + 'Qmc1rfcs7w7wRs2Ey8GXsfGFA5GhSULiJ9yvQvxwBmVpay',
  'beak': ipfsGateway + 'Qmamqckr2cpqfXGfDroDZTY61k9by2tYAsw1HeBKEcAg8n',
  'eyes': ipfsGateway + 'QmaapjJRWBzUvgGfJLdkFtjdBRZCvyPkv7oSM9xxbehDJq',
  'skin': ipfsGateway + 'QmdBbSbwW9Ho7Yk2sKLnV8bbvrwLzJfhLUejQpH7CvGkik',
};

function getNetworkInfos() {
  if (useDevnet) {
    return {
      api: process.env.REACT_APP_DEVNET_API ?? 'https://apc-marketplace-api-devnet.herokuapp.com/',
      explorerUrl: 'https://devnet-explorer.elrond.com/',
      customisationContractAddress: Address.fromBech32(devnetToolDeploy.customizationContractAddress.bech32),
      penguinCollection: devnetToolDeploy.penguinsIdentifier,
      marketplaceContractAddress: Address.fromBech32('erd1qqqqqqqqqqqqqpgqffweul9250tqr4vuf04zxdcpjdy82yvpv4xq4uha83'),
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
export const explorer = new Explorer(getNetworkInfos().explorerUrl);