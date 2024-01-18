import { InjectionToken } from "@angular/core";


export const MIN_SEARCH_LENGTH: InjectionToken<number> = new InjectionToken<number>("MIN_SEARCH_LENGTH", {
    providedIn: "root",
    factory: () => 3,
});
