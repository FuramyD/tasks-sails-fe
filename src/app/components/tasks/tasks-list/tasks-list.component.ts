import { ChangeDetectionStrategy, Component, Inject, inject, Injector, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TasksListComponentStore } from "./store/tasks-list.component-store";
import { debounceTime, distinctUntilChanged, filter, map, Observable, startWith, tap } from "rxjs";
import { MIN_SEARCH_LENGTH } from "../../../tokens/min-search-length.token";
import { TasksItemComponent } from "../tasks-item/tasks-item.component";
import { Task } from "../../../models/tasks/task.model";
import {
    TuiButtonModule,
    TuiDialogContext,
    TuiDialogModule,
    TuiDialogService,
    TuiLoaderModule,
    TuiRootModule
} from "@taiga-ui/core";
import { TuiInputModule } from "@taiga-ui/kit";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { AuthService } from "../../../services/auth.service";
import { TaskFormComponent } from "../task-form/task-form.component";
import { TaskFormValue } from "../../../models/payloads/tasks/forms/task-form-value";
import { TaskFormPopupComponent } from "../task-form-popup/task-form-popup.component";
import { PolymorpheusContent } from "@tinkoff/ng-polymorpheus";
import { TuiIconModule } from "@taiga-ui/experimental";
import { TasksListContainerComponent } from "../tasks-list-container/tasks-list-container.component";
import { CdkDropListGroup } from "@angular/cdk/drag-drop";
import { processSearchValue } from "../../../utils/rxjs/operators/process-search-value.operator";

@Component({
    selector: "app-tasks-list",
    standalone: true,
    imports: [CommonModule, TasksItemComponent, TuiButtonModule, TuiInputModule, ReactiveFormsModule, TaskFormPopupComponent, TaskFormComponent, TuiDialogModule, TuiIconModule, TasksListContainerComponent, CdkDropListGroup, TuiLoaderModule],
    templateUrl: "./tasks-list.component.html",
    styleUrl: "./tasks-list.component.less",
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [TasksListComponentStore],
})
export class TasksListComponent implements OnInit {
    private readonly tasksListComponentStore: TasksListComponentStore = inject(TasksListComponentStore);
    private readonly minSearchValueLength: number = inject(MIN_SEARCH_LENGTH);
    private readonly authService: AuthService = inject(AuthService);
    private readonly dialogs: TuiDialogService = inject(TuiDialogService);

    private currentUserId?: number;

    public isTaskFormPopupOpened: boolean = false;
    public editingTask?: Task;

    public readonly toDoTasks$: Observable<Task[]> = this.tasksListComponentStore.tasks$.pipe(
        map((tasks: Task[]) => tasks.filter((task: Task) => !task.completed)),
    );
    public readonly doneTasks$: Observable<Task[]> = this.tasksListComponentStore.tasks$.pipe(
        map((tasks: Task[]) => tasks.filter((task: Task) => task.completed)),
    );
    public readonly loading$: Observable<boolean> = this.tasksListComponentStore.loading$;
    public readonly searchControl: FormControl<string> = new FormControl<string>("", { nonNullable: true });


    public ngOnInit(): void {
        this.currentUserId = this.authService.getCurrentUserInfo()!.id;
        this.tasksListComponentStore.loadTasks(this.searchControl.valueChanges.pipe(
            tap(() => this.tasksListComponentStore.setLoading(true)),
            processSearchValue({
                debounceTime: 500,
                distinctUntilChanged: true,
                // minSearchLength: this.minSearchValueLength,
                // whenSearchValueNotPassed: () => this.tasksListComponentStore.setLoading(false),
                whenNotDistinctive: () => this.tasksListComponentStore.setLoading(false),
            }),
            distinctUntilChanged(),
            startWith(""),
        ));
    }

    public onCreateTask(task: TaskFormValue): void {
        this.tasksListComponentStore.createTask({
            userId: this.currentUserId!,
            ...task
        });
    }

    public onUpdateTask(editingTask: Task, task: TaskFormValue): void {
        this.tasksListComponentStore.updateTask({
            ...editingTask,
            userId: this.currentUserId!,
            ...task
        });
    }

    public onChangeCompletedStateOfTask(droppedTask: Task, completed: boolean): void {
        if (droppedTask.completed !== completed) {
            this.tasksListComponentStore.updateTask({ id: droppedTask.id, completed });
        }

    }

    public openTaskFormPopup(task?: Task) {
        this.editingTask = task;
        this.isTaskFormPopupOpened = true;
    }

    showDialog(test: PolymorpheusContent<TuiDialogContext>): void {
        this.dialogs.open(test, {
            size: 's',
            closeable: true,
            dismissible: true,
            label: 'Dialog',
            data: 'test',
        }).subscribe({
            next: data => {
                console.info(`Dialog emitted data = ${data}`);
            },
            complete: () => {
                console.info('Dialog closed');
            },
        });
    }
}
