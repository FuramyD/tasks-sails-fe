import { Observable } from "rxjs";
import { Provider } from "@angular/core";
import { TUI_DIALOGS_CLOSE } from "@taiga-ui/core";

export function provideCloseDialogCondition(condition: () => Observable<boolean>): Provider {
    return {
        provide: TUI_DIALOGS_CLOSE,
        useFactory: () => condition()
    }
}
