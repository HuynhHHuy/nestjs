import { HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Todo } from "src/todos/entities/todo.entity";
import { QueryParamsDto } from "./dto/query-params.dto";
import { TodoRepository } from "./todos.repository";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { UpdateTodoDto } from "./dto/update-todo.dto";
import { CategoriesService } from 'src/categories/categories.service';
import { UsersService } from 'src/users/users.service';

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
            throw new Error(`Todo with ID ${id} not found`);
        }

        return todo;
    }

    create(createTodoDto: CreateTodoDto): Todo {
        const user = this.usersService.findById(createTodoDto.userId);
        if (!user) {
            throw new Error(`Không tìm thấy user với id ${createTodoDto.userId}`);
        }

        if (createTodoDto.categoryId) {
            const category = this.categoriesService.findById(createTodoDto.categoryId);
            if (!category) {
                throw new HttpException(`Không tìm thấy category với id ${createTodoDto.categoryId}`, HttpStatus.NOT_FOUND);
            }
        }
        return this.todoRepository.create(createTodoDto);
    }

    update(id: number, updatedTodoDto: UpdateTodoDto): Todo | undefined {
        const todo = this.todoRepository.findById(id);

        if (!todo) {
            throw new Error(`Todo with ID ${id} not found`);
        }

        return this.todoRepository.update(id, updatedTodoDto);
    }

    delete(id: number): boolean {
        const todo = this.todoRepository.findById(id);

        if (!todo) {
            throw new Error(`Todo with ID ${id} not found`);
        }

        return this.todoRepository.delete(id);
    }
}