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

export const twitter = 'https://twitter.com/angrypenguins_';
export const discordInvitation = 'https://discord.com/invite/GKUV3XFcG8';

export const defaultImages = {
  'background': 'https://apc-items.s3.eu-west-3.amazonaws.com/render/default-background-render.png',
  'beak': 'https://apc-items.s3.eu-west-3.amazonaws.com/render/default-beak-render.png',
  'eyes': 'https://apc-items.s3.eu-west-3.amazonaws.com/render/default-eyes-render.png',
  'skin': 'https://apc-items.s3.eu-west-3.amazonaws.com/render/default-skin-render.png',
};

export const slots = [
  'hat',
  'beak',
  'skin',
  'weapon',
  'background',
  'eyes',
  'clothes'
];

function getNetworkInfos() {
  if (useDevnet) {
    return {
      api: process.env.REACT_APP_DEVNET_API ?? 'https://apc-marketplace-api-devnet.herokuapp.com/',
      explorerUrl: 'https://devnet-explorer.elrond.com/',
      customisationContractAddress: Address.fromBech32(devnetToolDeploy.customizationContractAddress.bech32),
      penguinCollection: devnetToolDeploy.penguinsIdentifier,
      marketplaceContractAddress: Address.fromBech32('erd1qqqqqqqqqqqqqpgqffweul9250tqr4vuf04zxdcpjdy82yvpv4xq4uha83'),
      items: devnetToolDeploy.items,
      itemsIdentifier: devnetToolDeploy.itemsIdentifier,
      penguinsCount: 5555,
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
export const penguinsCount = getNetworkInfos().penguinsCount;
export const itemsIdentifier = getNetworkInfos().itemsIdentifier;