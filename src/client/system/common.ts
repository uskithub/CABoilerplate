import { isRef, isReactive } from "vue";
import {  } from "vue";
import { WatchSource } from "vue";
import { watch } from "vue";

// Storeの内容をViewでStateとしてもたせる場合の状態
export const SyncState = {
    synced : "synced"
    , editing: "editing"
    , conflicting: "conflicting"
    , reflecting : "reflecting"
} as const;

export type SyncState = typeof SyncState[keyof typeof SyncState];

/**
 * firebaseとの同期を意識したクラス
 * targetValueはStore変数。reflectを呼び出してfirestoreに変更を反映し、Storeが更新されると、watchが反応して _value を更新する（Synced状態になる）。
 */
export class Syncable<T extends object> {
    private _state: SyncState = SyncState.synced;
    private _lastUpdatedAt: Date | null = null;
    private _value: T;
    
    constructor(storedProperty: T) {
        this._value = storedProperty;
        watch(storedProperty, (newValue) => {
            console.log("### Syncable", this.state, newValue);
            if (this.state === SyncState.synced) {
                this._value = newValue;
            } else if (this.state === SyncState.reflecting) {
                this.state = SyncState.synced;
                this._value = newValue;
            } else if (this.state === SyncState.editing) {
                this.state = SyncState.conflicting;
            }
        });
    }

    get value(): T {
        return this._value;
    }

    set value(newValue: T) {
        this._value = newValue;
        if (this.state === SyncState.synced) {
            this.state = SyncState.editing;
        }
    }

    get state(): SyncState {
        return this._state;
    }

    private set state(newState: SyncState) {
        this._state = newState;
        this._lastUpdatedAt = new Date();
    }

    get lastUpdatedAt(): Date | null {
        return this._lastUpdatedAt;
    }

    reflect(f: () => Promise<void>): Promise<void> {
        if (this.state === SyncState.editing) {
            this.state = SyncState.reflecting;
            return f();
        } else if (this.state === SyncState.conflicting) {
            return Promise.reject("conflicting");
        } else {
            return Promise.reject(this.state);
        }
    }
};

export function log(message?: any, ...optionalParams: any[]): void {
    console.log(message, ...optionalParams);
}

// eslint-disable-next-line @typescript-eslint/ban-types
const isFunction = (val: unknown): val is Function => typeof val === "function";

export function whenNoLongerNull<T extends object >(source: WatchSource<T | null>, then: (value: T) => any): void {
    const t = (() => {
        if (isRef(source)) {
            return source.value;
        } else if (isReactive(source) || isFunction(source)){
            return source();
        }
        return null;
    })();
    
    if (t !== null) {
        then(t);
    } else {
        const stopHandle = watch(source, (newValue) => {
            if (newValue) {
                stopHandle();
                then(newValue);
            } 
        });
    }
}
