import { InjectionToken } from "@angular/core";


export const WINDOW_REF = new InjectionToken<Window>("window ref", {
    factory: () => {
        if (!window) {
            throw new Error("Window doesn't exist");
        }

        return window;
    }
})
