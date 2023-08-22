import devnetConfig from '@apcolony/db-marketplace/out/devnet';
import mainnetConfig from '@apcolony/db-marketplace/out/mainnet';
import { Address } from '@multiversx/sdk-core/out';
import APCLogger, { LogType } from 'logger';
import Explorer from 'sdk/classes/Explorer';

const logFlags = process.env.REACT_APP_MUTED_LOG?.split(' ') ?? [];
console.log('Muted logs', logFlags);
console.log('Using network', process.env.REACT_APP_NETWORK_TYPE);
export const apcLogger = new APCLogger(logFlags as LogType[]);

export const dAppName = 'Marketplace';

export const twitter = 'https://twitter.com/angrypenguins_';
export const discordInvitation = 'https://discord.com/invite/estar';

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
  return {
    api: process.env.REACT_APP_MAINNET_API ?? 'https://api.marketplace.angrypenguinscolony.com/',
    explorerUrl: 'https://explorer.multiversx.com/',
    environment: 'mainnet',
    ...mainnetConfig
  }

}

// TODO: remove this repetitive part of code
export const marketplaceApi = getNetworkInfos().api;
export const customisationContractAddress: Address = new Address(getNetworkInfos().customisationContractAddress);
export const marketplaceContractAddress: Address = new Address(getNetworkInfos().sellingContract);
export const penguinCollection = getNetworkInfos().penguinsCollection;
export const explorer = new Explorer(getNetworkInfos().explorerUrl);
export const penguinsCount = getNetworkInfos().penguinsCount;
export const itemsCollections = getNetworkInfos().itemsCollections;
export const stakingContract: Address = new Address(getNetworkInfos().stakingContract);
export const stakingToken = getNetworkInfos().nftStakingToken;
export const itemsDatabase = getNetworkInfos().itemsDatabase;
export const environment = getNetworkInfos().environment;
export const stakeTokenName = '$ICE Power';

if (marketplaceApi.endsWith('/') == false) {
  throw new Error('Marketplace API should end with a slash');
}

export const hatchLink = 'https://angrypenguinscolony.com/hatch';