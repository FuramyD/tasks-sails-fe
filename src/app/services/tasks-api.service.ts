import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BACKEND_URL } from "../tokens/backend-url.token";
import { Observable } from "rxjs";
import { Task } from "../models/tasks/task.model";
import { CreateTaskPayload } from "../models/payloads/tasks/create-task.payload";
import { UpdateTaskPayload } from "../models/payloads/tasks/update-task.payload";
import { Label } from "../models/label.model";


@Injectable({
    providedIn: "root"
})
export class TasksApiService {

    private readonly httpClient: HttpClient = inject(HttpClient);
    private readonly backendEndpoint: string = inject(BACKEND_URL);


    public getAllTasks(searchValue: string): Observable<Task[]> {
        return this.httpClient.get<Task[]>(`${this.backendEndpoint}/tasks?search=${searchValue}`);
    }

    public createTask(task: CreateTaskPayload): Observable<Task> {
        return this.httpClient.post<Task>(`${this.backendEndpoint}/tasks`, task);
    }

    public updateTask(task: UpdateTaskPayload): Observable<Task> {
        return this.httpClient.patch<Task>(`${this.backendEndpoint}/tasks/${task.id}/update`, task);
    }

    public removeTask(taskId: Task["id"]): Observable<void> {
        return this.httpClient.delete<void>(`${this.backendEndpoint}/tasks/${taskId}`);
    }

    public getLabels(searchValue: string): Observable<Label[]> {
        return this.httpClient.get<Label[]>(`${this.backendEndpoint}/labels?search=${searchValue}`);
    }

}
