import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Todo } from "src/todos/entities/todo.entity";
import { QueryParamsDto } from "./dto/query-params.dto";
import { TodoRepository } from "./todos.repository";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { UpdateTodoDto } from "./dto/update-todo.dto";
import { CategoriesService } from 'src/categories/categories.service';
import { UsersService } from 'src/users/users.service';
import { TodoNotFoundException } from './exceptions/todo-not-found.exception';

@Injectable()
export class TodoService {

    constructor(
        private todoRepository: TodoRepository,
        private readonly categoriesService: CategoriesService,
        private readonly usersService: UsersService
    ) { }

    findAll(queryParamsDto: QueryParamsDto): Todo[] {
        let todos = this.todoRepository.findAll();
        if (queryParamsDto.priority) {
            todos = todos.filter(todo => todo.priority === queryParamsDto.priority);
        }
        const page = queryParamsDto.page ?? 1;
        const limit = queryParamsDto.limit ?? 10;
        const startIndex = (page - 1) * limit;
        return todos.slice(startIndex, startIndex + limit);
    }

    findById(id: number): Todo | undefined {
        const todo = this.todoRepository.findById(id);

        if (!todo) {
            throw new TodoNotFoundException(id);
        }

        return todo;
    }

    create(createTodoDto: CreateTodoDto): Todo {
        const user = this.usersService.findById(createTodoDto.userId);
        if (!user) {
            throw new NotFoundException({
                message: `User with ID ${createTodoDto.userId} not found`,
                errorCode: 'USER_NOT_FOUND',
                field: 'userId',
                statusCode: 404
            });
        }

        if (createTodoDto.categoryId) {
            const category = this.categoriesService.findById(createTodoDto.categoryId);
            if (!category) {
                throw new NotFoundException({
                    message: `Category with ID ${createTodoDto.categoryId} not found`,
                    errorCode: 'CATEGORY_NOT_FOUND',
                    field: 'categoryId',
                    statusCode: 404
                });
            }
        }

        if (createTodoDto.title) {
            const existingTodos = this.todoRepository.findByTitle(createTodoDto.title);
            if (existingTodos) {
                throw new BadRequestException({
                    message: `A todo with the title "${createTodoDto.title}" already exists`,
                    errorCode: 'TODO_TITLE_EXISTS',
                    field: 'title',
                    statusCode: 400
                });
            }
        }
        return this.todoRepository.create(createTodoDto);
    }

    update(id: number, updatedTodoDto: UpdateTodoDto): Todo | undefined {
        const todo = this.todoRepository.findById(id);

        if (!todo) {
            throw new TodoNotFoundException(id);
        }

        return this.todoRepository.update(id, updatedTodoDto);
    }

    delete(id: number): boolean {
        const todo = this.todoRepository.findById(id);

        if (!todo) {
            throw new TodoNotFoundException(id);
        }
        return this.todoRepository.delete(id);
    }
}