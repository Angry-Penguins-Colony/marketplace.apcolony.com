import { Response } from 'express';
import { placeholdersEggs, placeholdersItems, placeholdersPenguins } from '../../const';
import { sendSuccessfulJSON } from '../../utils/response';

export function getPlaceholdersPenguins(res: Response) {
    sendSuccessfulJSON(res, [
        placeholdersPenguins[1155],
        placeholdersPenguins[4782],
        placeholdersPenguins[4987]
    ])
}

export function getPlaceholdersEggs(res: Response) {

    const data = [
        placeholdersEggs.silver,
        placeholdersEggs.silver,
        placeholdersEggs.silver,
        placeholdersEggs.gold,
        placeholdersEggs.gold,
        placeholdersEggs.diamond,
        placeholdersEggs.diamond,
    ];

    sendSuccessfulJSON(res, data);
}

export function getPlaceholdersItems(res: Response) {

    const data = [
        placeholdersItems.beak.Pipe,
        placeholdersItems.background.Red,
        placeholdersItems.hat['Blue Bitcoin Cap'],
        placeholdersItems.clothes['Coat With Brown Fur'],
        placeholdersItems.eyes.Black,
        placeholdersItems.eyes.EGLD,
    ];

    sendSuccessfulJSON(res, data);
}