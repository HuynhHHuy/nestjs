import { TodoPriority } from "src/todos/enum/todo-priority.enum";
import { TodoStatus } from "src/todos/enum/todo-status.enum";

export class UpdateTodoDto {
    title?: string;
    description?: string;
    status?: TodoStatus;
    priority?: TodoPriority;
    categoryId?: number;
}
