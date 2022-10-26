import BackgroundThumbnail from 'assets/img/icons/items/thumbnail/background.png';
import BeakThumbnail from 'assets/img/icons/items/thumbnail/beak.png';
import ClothesThumbnail from 'assets/img/icons/items/thumbnail/clothes.png';
import EyesThumbnail from 'assets/img/icons/items/thumbnail/eyes.png';
import HatThumbnail from 'assets/img/icons/items/thumbnail/hat.png';
import SkinThumbnail from 'assets/img/icons/items/thumbnail/skin.png';
import WeaponThumbnail from 'assets/img/icons/items/thumbnail/weapon.png';
import BackgroundUnicolor from 'assets/img/icons/items/unicolor_blue/background.svg';
import BeakUnicolor from 'assets/img/icons/items/unicolor_blue/beak.svg';
import ClothesUnicolor from 'assets/img/icons/items/unicolor_blue/clothes.svg';
import EyesUnicolor from 'assets/img/icons/items/unicolor_blue/eyes.svg';
import HatUnicolor from 'assets/img/icons/items/unicolor_blue/hat.svg';
import SkinUnicolor from 'assets/img/icons/items/unicolor_blue/skin.svg';
import WeaponUnicolor from 'assets/img/icons/items/unicolor_blue/weapon.svg';

interface IIcon {
    unicolor: string;
    thumbnail: string,
}


export const icons: { [key: string]: IIcon } = {
    background: {
        unicolor: BackgroundUnicolor,
        thumbnail: BackgroundThumbnail,
    },
    beak: {
        unicolor: BeakUnicolor,
        thumbnail: BeakThumbnail,
    },
    clothes: {
        unicolor: ClothesUnicolor,
        thumbnail: ClothesThumbnail,
    },
    eyes: {
        unicolor: EyesUnicolor,
        thumbnail: EyesThumbnail,
    },
    hat: {
        unicolor: HatUnicolor,
        thumbnail: HatThumbnail,
    },
    skin: {
        unicolor: SkinUnicolor,
        thumbnail: SkinThumbnail,
    },
    weapon: {
        unicolor: WeaponUnicolor,
        thumbnail: WeaponThumbnail,
    }
};