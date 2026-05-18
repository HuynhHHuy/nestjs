import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, Max, Min } from "class-validator";
import { TodoPriority } from "src/todos/enum/todo-priority.enum";

export class QueryParamsDto {
    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    page?: number = 1;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(100)
    @Type(() => Number)
    limit?: number = 10;

    @IsOptional()
    @IsEnum(TodoPriority, { message: `priority must be one of the following values: ${Object.values(TodoPriority).join(', ')}` })
    priority?: TodoPriority;
}
