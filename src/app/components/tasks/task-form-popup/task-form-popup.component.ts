import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DIALOG_DATA, DialogModule, DialogRef } from "@angular/cdk/dialog";
import { TaskFormComponent } from "../task-form/task-form.component";
import { TaskFormValue } from "../../../models/payloads/tasks/forms/task-form-value";
import { Task } from "../../../models/tasks/task.model";
import { PortalHostComponent } from "../../../utils/tui-utils/portals/portal-host/portal-host.component";

@Component({
    selector: "app-task-form-popup",
    standalone: true,
    imports: [CommonModule, DialogModule, TaskFormComponent, PortalHostComponent],
    templateUrl: "./task-form-popup.component.html",
    styleUrl: "./task-form-popup.component.less"
})
export class TaskFormPopupComponent {
    public readonly dialogRef: DialogRef<TaskFormValue> = inject(DialogRef);
    public readonly task: Task | undefined = inject(DIALOG_DATA);
}
