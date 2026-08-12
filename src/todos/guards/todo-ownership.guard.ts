import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { TodoService } from "../todos.service";
import { Request } from "express";

@Injectable()
export class TodoOwnershipGuard implements CanActivate {
    constructor(private readonly todoService: TodoService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const todoId = Number(request.params.id);

        if (!request.userId) {
            return false;
        }

        const todo = await this.todoService.findById(todoId);

        if (!todo) {
            return false;
        }

        if (todo.userId !== request.userId) {
            return false;
        }

        request.todo = todo;
        return true;
    }
}