import Devnet from '@apcolony/db-marketplace/out/devnet';
import { Address } from '@elrondnetwork/erdjs/out';
import APCLogger, { LogType } from 'logger';
import Explorer from 'sdk/classes/Explorer';

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

export function getBadgeUri(id: number) {
  // source: https://stackoverflow.com/questions/40716894/angular2-or-typescript-left-padding-a-string-with-zeros
  function pad(num: number, size: number): string {
    let s = num + '';
    while (s.length < size) s = '0' + s;
    return s;
  }

  return `https://apc-items.s3.eu-west-3.amazonaws.com/badges_render/badges-${pad(id, 5)}-render.png`;
}

function getNetworkInfos() {
  switch (process.env.REACT_APP_NETWORK_TYPE) {
    case 'DEVNET':
      return {
        api: process.env.REACT_APP_DEVNET_API ?? 'https://marketplace-api-devnet.onrender.com/',
        explorerUrl: 'https://devnet-explorer.elrond.com/',
        customisationContractAddress: Address.fromBech32(Devnet.customisationContractAddress),
        penguinCollection: Devnet.penguinsIdentifier,
        marketplaceContractAddress: Address.fromBech32(Devnet.sellingContract),
        items: Devnet.items,
        itemsDatabase: Devnet.itemsDatabase,
        itemsCollections: Devnet.itemsIdentifier,
        penguinsCount: Devnet.penguinsCount,
        stakingContractAddress: Address.fromBech32(Devnet.stakingContract),
        stakingToken: Devnet.nftStakingToken,
      }
    case 'MAINNET':
      throw new Error('Mainnet not supported yet');

    default:
      throw new Error('Unknown network');
  }
}

export const marketplaceApi = getNetworkInfos().api;
export const customisationContractAddress = getNetworkInfos().customisationContractAddress;
export const penguinCollection = getNetworkInfos().penguinCollection;
export const marketplaceContractAddress = getNetworkInfos().marketplaceContractAddress;
export const items = getNetworkInfos().items;
export const explorer = new Explorer(getNetworkInfos().explorerUrl);
export const penguinsCount = getNetworkInfos().penguinsCount;
export const itemsCollections = getNetworkInfos().itemsCollections;
export const stakingContract = getNetworkInfos().stakingContractAddress;
export const stakingToken = getNetworkInfos().stakingToken;
export const itemsDatabase = getNetworkInfos().itemsDatabase;