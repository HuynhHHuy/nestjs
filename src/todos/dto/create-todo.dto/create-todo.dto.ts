import { IsEnum, IsIn, IsInt, IsOptional, IsString, MinLength } from "class-validator";
import { TodoPriority } from "src/todos/enum/todo-priority.enum";
import { TodoStatus } from "src/todos/enum/todo-status.enum";

export class CreateTodoDto {

    @IsString()
    @MinLength(1, { message: "Title must not be empty" })
    title: string | undefined;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsEnum(TodoStatus, { message: `Status must be one of: ${Object.values(TodoStatus).join(', ')}` })
    status?: TodoStatus;

    @IsOptional()
    @IsEnum(TodoPriority, { message: `Priority must be one of: ${Object.values(TodoPriority).join(', ')}` })
    priority?: TodoPriority;

    @IsOptional()
    @IsInt({ message: "Category ID must be an integer" })
    categoryId?: number;
}
