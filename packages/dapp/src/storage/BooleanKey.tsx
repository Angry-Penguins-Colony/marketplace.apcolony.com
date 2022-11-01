
export default class BooleanKey {
    constructor(
        public readonly key: string,
        public readonly defaultValue: boolean
    ) { }

    get value(): boolean {
        const fromStorage = window.sessionStorage.getItem(this.key);

        if (fromStorage) {
            return fromStorage === 'true';
        }
        else {
            return this.defaultValue;
        }
    }

    set value(value: boolean) {
        window.sessionStorage.setItem(this.key, value.toString());
    }
}
