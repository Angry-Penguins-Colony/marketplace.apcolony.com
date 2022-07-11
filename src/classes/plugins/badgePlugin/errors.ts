export class CannotUseBadgeAsSlotName extends Error {
    constructor(badgeSlotName: string) {
        super(`Sorry, you cannot use ${badgeSlotName} as a slot name.`);
    }
}

export class CannotSetBadgeInDefaultLayers extends Error {
    constructor(badgeSlotName: string) {
        super(`Sorry, you cannot set ${badgeSlotName} as a default layer.`);
    }
}