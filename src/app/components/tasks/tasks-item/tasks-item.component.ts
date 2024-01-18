import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    EventEmitter, HostBinding,
    inject,
    Input,
    Output
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { Task } from "../../../models/tasks/task.model";
import { TuiLineClampModule } from "@taiga-ui/kit";
import { TuiButtonModule } from "@taiga-ui/core";
import { TuiIconModule } from "@taiga-ui/experimental";
import { TaskDifficultyComponent } from "../task-difficulty/task-difficulty.component";
import { WINDOW } from "@ng-web-apis/common";

@Component({
    selector: "app-tasks-item",
    standalone: true,
    imports: [CommonModule, TuiButtonModule, TuiIconModule, TuiLineClampModule, TaskDifficultyComponent],
    templateUrl: "./tasks-item.component.html",
    styleUrl: "./tasks-item.component.less",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksItemComponent {
    @Input({ required: true }) task!: Task;

    @HostBinding("class._dragging")
    @Input({ transform: booleanAttribute }) dragging: boolean = false;

    @Output() updateTask: EventEmitter<void> = new EventEmitter<void>();

    private readonly windowRef: Window = inject(WINDOW);

    public get isExpiredTask(): boolean {
        console.log({ date: Number(new Date(this.task.dueDate)), now: Date.now(), return: Number(new Date(this.task.dueDate)) <= Date.now() });
        return Number(new Date(this.task.dueDate)) <= Date.now();
    }

    getDynamicLineHeight(element: HTMLDivElement): number {
        return parseInt(this.windowRef.getComputedStyle(element).lineHeight, 10);
    }

    getDynamicLineLimit(element: HTMLDivElement): number {
        return Math.floor(element.offsetHeight / 24);
    }
}
