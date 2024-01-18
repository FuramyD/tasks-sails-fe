import { inject, InjectionToken } from "@angular/core";
import { WINDOW_REF } from "./window-ref.token";


export const SESSION_STORAGE = new InjectionToken<Storage>("session storage ref", {
    factory: () => {
        const window = inject(WINDOW_REF);
        return window.sessionStorage;
    }
})
