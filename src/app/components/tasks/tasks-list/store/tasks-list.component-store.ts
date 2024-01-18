import { inject, Injectable } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { Task } from "../../../../models/tasks/task.model";
import { finalize, Observable, switchMap } from "rxjs";
import { TasksApiService } from "../../../../services/tasks-api.service";
import { HttpErrorResponse } from "@angular/common/http";
import { CreateTaskPayload } from "../../../../models/payloads/tasks/create-task.payload";
import { UpdateTaskPayload } from "../../../../models/payloads/tasks/update-task.payload";

export interface TasksListState {
    tasks: Task[];
    loading: boolean;
    creationLoading: boolean;
    updateLoading: boolean;
}

@Injectable()
export class TasksListComponentStore extends ComponentStore<TasksListState> {

    public readonly tasks$: Observable<Task[]> = this.select((state: TasksListState) => state.tasks);
    public readonly loading$: Observable<boolean> = this.select((state: TasksListState) => state.loading);
    public readonly creationLoading$: Observable<boolean> = this.select((state: TasksListState) => state.creationLoading);
    public readonly updateLoading$: Observable<boolean> = this.select((state: TasksListState) => state.updateLoading);

    public readonly setTasks = this.updater((state: TasksListState, tasks: Task[]) => ({
        ...state,
        tasks,
    }));

    public readonly setLoading = this.updater((state: TasksListState, loading: boolean) => ({
        ...state,
        loading,
    }));

    public readonly loadTasks = this.effect((searchValue$: Observable<string>) => searchValue$.pipe(
        switchMap((searchValue: string) => {
            this.setLoading(true);
            return this.tasksService.getAllTasks(searchValue).pipe(
                tapResponse(
                    (tasks: Task[]) => this.setTasks(tasks),
                    (error: HttpErrorResponse) => console.error("Error when fetching tasks:", error),
                ),
                finalize(() => this.setLoading(false)),
            );
        }),
    ));

    public readonly createTask = this.effect((task$: Observable<CreateTaskPayload>) => task$.pipe(
        switchMap((task: CreateTaskPayload) => {
            return this.tasksService.createTask(task).pipe(
                tapResponse(
                    (task: Task) => this.setTasks([...this.get().tasks, task]),
                    (error: HttpErrorResponse) => console.error("Error when creating a new task:", error),
                ),
            );
        }),
    ));

    public readonly updateTask = this.effect((task$: Observable<UpdateTaskPayload>) => task$.pipe(
        switchMap((task: UpdateTaskPayload) => {
            return this.tasksService.updateTask(task).pipe(
                tapResponse(
                    (updatedTask: Task) => this.setTasks(this.get().tasks.map((task: Task) => task.id === updatedTask.id ? updatedTask : task)),
                    (error: HttpErrorResponse) => console.error("Error when updating task:", error),
                ),
            );
        }),
    ));

    private readonly setCreationLoading = this.updater((state: TasksListState, creationLoading: boolean) => ({
        ...state,
        creationLoading,
    }));

    private readonly setUpdateLoading = this.updater((state: TasksListState, updateLoading: boolean) => ({
        ...state,
        updateLoading,
    }));


    private readonly tasksService: TasksApiService = inject(TasksApiService);

    constructor() {
        super({
            tasks: [],
            loading: true,
            creationLoading: false,
            updateLoading: false,
        });
    }

}
