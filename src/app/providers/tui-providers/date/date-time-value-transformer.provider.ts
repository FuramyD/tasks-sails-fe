import { TUI_DATE_TIME_VALUE_TRANSFORMER } from "@taiga-ui/kit";
import { Provider, Type } from "@angular/core";
import { AbstractTuiValueTransformer, TuiDay, TuiTime } from "@taiga-ui/cdk";


export function provideDateTimeValueTransformer<T>(dateTimeValueTransformer: Type<AbstractTuiValueTransformer<[TuiDay | null, TuiTime | null], T>>): Provider {
    return {
        provide: TUI_DATE_TIME_VALUE_TRANSFORMER,
        useClass: dateTimeValueTransformer
    }
}
