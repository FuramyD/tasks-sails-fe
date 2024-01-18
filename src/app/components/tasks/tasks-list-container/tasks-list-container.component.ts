import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TasksItemComponent } from "../tasks-item/tasks-item.component";
import { TuiIconModule } from "@taiga-ui/experimental";
import { Task } from "../../../models/tasks/task.model";
import {
    CdkDrag,
    CdkDragDrop,
    CdkDragPlaceholder,
    CdkDropList,
    moveItemInArray,
    transferArrayItem
} from "@angular/cdk/drag-drop";

@Component({
    selector: "app-tasks-list-container",
    standalone: true,
    imports: [CommonModule, TasksItemComponent, TuiIconModule, CdkDrag, CdkDropList, CdkDragPlaceholder],
    templateUrl: "./tasks-list-container.component.html",
    styleUrls: ["./tasks-list-container.component.less"]
})
export class TasksListContainerComponent {

    @Input({ required: true }) set tasks(tasks: Task[]) {
        this._tasks = tasks ?? [];
        this.isEmptyContainerHidden = this._tasks.length !== 0;
    }

    @Input({ required: true }) heading!: string;
    @Input({ required: true }) icon!: string;

    @Output() updateTask: EventEmitter<Task> = new EventEmitter<Task>();
    @Output() taskDropped: EventEmitter<Task> = new EventEmitter<Task>();

    public isEmptyContainerHidden: boolean = false;
    public draggingObject: object | null = null;
    public _tasks: Task[] = [];

    public onItemEntered(): void {
        this.isEmptyContainerHidden = true;
    }

    public onItemExited(): void {
        this.isEmptyContainerHidden = this._tasks.length !== 0;
    }

    public onItemDrop($event: CdkDragDrop<Task[]>) {
        this.isEmptyContainerHidden = true;
        this._tasks.includes($event.item.data)
            ? moveItemInArray(this._tasks, $event.previousIndex, $event.currentIndex)
            : transferArrayItem($event.previousContainer.data, this._tasks, $event.previousIndex, $event.currentIndex);
        this.taskDropped.emit($event.item.data)
    }

    public setDraggingObject(draggingObject: object | null): void {
        this.draggingObject = draggingObject;
    }

}
