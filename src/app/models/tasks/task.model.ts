import { TaskDifficulty } from "./task-difficulty.enum";
import { Values } from "../../utils/types/utility-types/values";
import { User } from "../payloads/users/user.model";
import { Label } from "../label.model";


export interface Task {
    id: number;
    createdDate: string;
    updatedDate: string;
    title: string;
    description: string;
    dueDate: string;
    completed: boolean;
    userId: number;
    difficulty: Values<typeof TaskDifficulty>;
    assignee: User;
    createdBy: User;
    labels: Label[];
    comments: Comment[];
}
