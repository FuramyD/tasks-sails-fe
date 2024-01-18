import { CreateTaskPayload } from "../create-task.payload";


export type TaskFormValue = Omit<CreateTaskPayload, "userId">;
