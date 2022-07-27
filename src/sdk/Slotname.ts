export default class Slotname {

    private readonly slotname: string;

    constructor(slotname: string) {
        this.slotname = slotname;
    }

    public valueOf(): string {
        return this.slotname;
    }
}