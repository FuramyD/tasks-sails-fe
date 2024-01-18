import { TuiRootModule, TuiAlertModule, TUI_SANITIZER, TuiScrollbarModule } from "@taiga-ui/core";
import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import { NgDompurifySanitizer } from "@tinkoff/ng-dompurify";
import { PortalHostComponent } from "./utils/tui-utils/portals/portal-host/portal-host.component";
import { TuiPortalModule } from "@taiga-ui/cdk";

@Component({
    selector: "app-root",
    standalone: true,
    imports: [CommonModule, RouterOutlet, TuiRootModule, TuiAlertModule, PortalHostComponent, TuiPortalModule, TuiScrollbarModule],
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.less",
    providers: [
        // {
        //     provide: TUI_SANITIZER,
        //     useClass: NgDompurifySanitizer,
        // }
    ]
})
export class AppComponent {

}
