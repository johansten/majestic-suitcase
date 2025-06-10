export class PersistentMap extends Map {
    #storageKey: string;

    constructor(storageKey: string) {
        super();
        this.#storageKey = storageKey;
        this.load();
    }

    set(key: string, value) {
        super.set(key, value);
        this.save();
        return this;
    }

    delete(key: string) {
        const result = super.delete(key);
        this.save();
        return result;
    }

    clear() {
        super.clear();
        this.save();
    }

    async load() {
        const res = await chrome.storage.local.get(this.#storageKey);
        const entries = res[this.#storageKey];
        if (entries) {
            for (const [key, value] of entries) {
                super.set(key, value);
            }
        }
    }

    async save() {
        const entries = Array.from(this.entries());
        const res = await chrome.storage.local.set({[this.#storageKey]: entries});
    }
}
