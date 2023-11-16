import { isRef, isReactive } from "vue";
import {  } from "vue";
import { WatchSource } from "vue";
import { watch } from "vue";

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
