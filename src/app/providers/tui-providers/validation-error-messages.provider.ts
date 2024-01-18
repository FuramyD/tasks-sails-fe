import { Provider } from "@angular/core";
import { TUI_VALIDATION_ERRORS } from "@taiga-ui/kit";


export function provideValidationErrorMessages(messages: Record<string, string>): Provider {
    return {
        provide: TUI_VALIDATION_ERRORS,
        useValue: messages,
    };
}
