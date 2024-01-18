import { tuiSvgOptionsProvider } from "@taiga-ui/core";
import { Provider } from "@angular/core";


export function provideIcons(icons: Record<string, string>): Provider {
    return tuiSvgOptionsProvider({

        path: (name: string) => {
            console.log({ icon: icons[name], name });
            return `assets/icons/${icons[name]}.svg#${icons[name]}`
        },
    });
}
