import { TodoPriority } from "src/todos/enum/todo-priority.enum";
import { TodoStatus } from "src/todos/enum/todo-status.enum";

export class Todo {
    id!: number;
    title!: string;
    description!: string;
    status!: TodoStatus;
    priority!: TodoPriority;
    userId!: number;
    categoryId!: number;
    createdAt!: Date;
    updatedAt!: Date;
}