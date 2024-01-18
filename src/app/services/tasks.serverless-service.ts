import { Injectable, inject } from "@angular/core";
import { Task } from "../models/tasks/task.model";
import { SESSION_STORAGE } from "../tokens/storage.token";
import { TASKS_KEY } from "../constants/storage.contstants";

@Injectable({
    providedIn: "root"
})
export class TasksServerlessService {
    private readonly sessionStorageRef: Storage = inject(SESSION_STORAGE);


    public set tasks(tasks: Task[]) {
        this.sessionStorageRef.setItem(TASKS_KEY, JSON.stringify(tasks));
    }

    public get tasks(): Task[] {
        const tasks: string | null = this.sessionStorageRef.getItem(TASKS_KEY);
        return tasks ? JSON.parse(tasks) : [];
    }

}
