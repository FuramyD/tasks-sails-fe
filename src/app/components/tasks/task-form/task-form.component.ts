import { Component, EventEmitter, inject, Input, OnInit, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Task } from "../../../models/tasks/task.model";
import { TaskDifficulty } from "../../../models/tasks/task-difficulty.enum";
import { isObject } from "../../../utils/types/type-guards/is-object";
import { TaskFormValue } from "../../../models/payloads/tasks/forms/task-form-value";
import {
    TuiComboBoxModule,
    TuiDataListWrapperModule,
    TuiFieldErrorPipeModule, TuiFilterByInputPipeModule,
    TuiInputDateTimeModule,
    TuiInputModule,
    TuiSelectModule, TuiStringifyContentPipeModule
} from "@taiga-ui/kit";
import { TuiButtonModule, TuiDropdownModule, TuiErrorModule } from "@taiga-ui/core";
import { PortalHostComponent } from "../../../utils/tui-utils/portals/portal-host/portal-host.component";
import { TuiDay, TuiPortalModule, TuiTime } from "@taiga-ui/cdk";
import { Values } from "../../../utils/types/utility-types/values";
import { BehaviorSubject, combineLatest, map, Observable, shareReplay, startWith, switchMap } from "rxjs";
import { User } from "../../../models/payloads/users/user.model";
import { processSearchValue } from "../../../utils/rxjs/operators/process-search-value.operator";
import { UsersService } from "../../../services/users.service";
import { Label } from "../../../models/label.model";
import { TasksApiService } from "../../../services/tasks-api.service";

@Component({
    selector: "app-task-form",
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, TuiInputModule, TuiButtonModule, TuiSelectModule, TuiDataListWrapperModule, TuiErrorModule, TuiFieldErrorPipeModule, TuiInputDateTimeModule, PortalHostComponent, TuiDropdownModule, TuiPortalModule, TuiComboBoxModule, TuiStringifyContentPipeModule, TuiFilterByInputPipeModule],
    templateUrl: "./task-form.component.html",
    styleUrl: "./task-form.component.less",
})
export class TaskFormComponent implements OnInit {
    private readonly usersService: UsersService = inject(UsersService);
    private readonly tasksApiService: TasksApiService = inject(TasksApiService);

    @Input() task?: Task;

    @Output() submitForm: EventEmitter<TaskFormValue> = new EventEmitter<TaskFormValue>();
    @Output() cancel: EventEmitter<void> = new EventEmitter<void>();

    public readonly Difficulty: Values<typeof TaskDifficulty>[] = Object.values(TaskDifficulty);
    public readonly now: [TuiDay, TuiTime] = [
        TuiDay.currentUtc(),
        TuiTime.current().shift({ hours: 1 }),
    ];

    public taskForm = new FormGroup({
        title: new FormControl("", {
            nonNullable: true,
            validators: [Validators.required, Validators.maxLength(256)],
        }),
        description: new FormControl("", {
            nonNullable: true,
            validators: [Validators.required],
        }),
        dueDate: new FormControl("", {
            nonNullable: true,
            validators: [Validators.required],
        }),
        difficulty: new FormControl<Values<typeof TaskDifficulty>>(TaskDifficulty.EASY),
        assignee: new FormControl<User | null>(null, {
            validators: [Validators.required],
        }),
        labels: new FormControl<Label[]>([], { nonNullable: true }),
    });

    public readonly users$: Observable<User[]>;
    public readonly labels$: Observable<Label[]>;
    public readonly userStringify = (user: User): string => `${user.username}`;


    private readonly usersSearch$: BehaviorSubject<string> = new BehaviorSubject<string>("");
    private readonly labelsSearch$: BehaviorSubject<string> = new BehaviorSubject<string>("");

    constructor() {
        this.users$ = this.usersSearch$.pipe(
            processSearchValue({
                distinctUntilChanged: true,
                debounceTime: 500,
            }),
            switchMap((searchValue: string) => this.usersService.getUsers(searchValue)),
            shareReplay({ refCount: true , bufferSize: 1 }),
        );
        this.labels$ = combineLatest([
            this.taskForm.controls.labels.valueChanges.pipe(
                startWith(this.taskForm.controls.labels.value)
            ),
            this.labelsSearch$.pipe(
                processSearchValue({
                    distinctUntilChanged: true,
                    debounceTime: 500,
                })
            )
        ]).pipe(
            switchMap(([labels, searchValue]) => this.tasksApiService.getLabels(searchValue).pipe(
                map((labelsFormServer: Label[]) => {
                    const setOfCurrentLabelIds: Set<Label["id"]> = new Set(labels.map((label: Label) => label.id));
                    return labelsFormServer.filter((label: Label) => !setOfCurrentLabelIds.has(label.id));
                })
            )),
            shareReplay({ refCount: true, bufferSize: 1 }),
        )
    }

    public ngOnInit(): void {
        this.setTaskFormValue(this.task);
    }

    public onFormSubmit(): void {
        if (this.taskForm.valid) {
            this.submitForm.emit({
                ...this.taskForm.getRawValue(),
                comments: this.task?.comments ?? [],
                assignee: this.taskForm.controls.assignee.value!,
            });
        }
    }

    public onSearchUsers(searchValue: string): void {
        console.log({ searchValue });
        this.usersSearch$.next(searchValue);
    }

    public extractValueFromEvent(event: Event): string | null {
        return (event.target as HTMLInputElement)?.value || null;
    }

    private setTaskFormValue(task?: Task) {
        if (isObject(task)) {
            this.taskForm.setValue({
                title: task.title,
                description: task.description,
                dueDate: task.dueDate,
                difficulty: task.difficulty,
                assignee: task.assignee,
                labels: task.labels ?? [],
            });
        }
    }
}
