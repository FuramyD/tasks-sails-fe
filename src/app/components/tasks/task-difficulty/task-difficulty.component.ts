import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TaskDifficulty } from "../../../models/tasks/task-difficulty.enum";
import { Values } from "../../../utils/types/utility-types/values";

@Component({
    selector: "app-task-difficulty",
    standalone: true,
    imports: [CommonModule],
    templateUrl: "./task-difficulty.component.html",
    styleUrl: "./task-difficulty.component.less"
})
export class TaskDifficultyComponent {
    @Input({ required: true }) taskDifficulty!: Values<typeof TaskDifficulty>;

    public readonly taskDifficulties = TaskDifficulty;
    public readonly difficulties: Values<typeof TaskDifficulty>[] = Object.values(TaskDifficulty);
}
