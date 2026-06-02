import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Todo } from "src/todos/entities/todo.entity";
import { QueryParamsDto } from "./dto/query-params.dto";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { UpdateTodoDto } from "./dto/update-todo.dto";
import { CategoriesService } from 'src/categories/categories.service';
import { UsersService } from 'src/users/users.service';
import { TodoNotFoundException } from './exceptions/todo-not-found.exception';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TodoService {

    constructor(
        @InjectRepository(Todo) //huong dan NestJS inject repository tu TypeORM
        private readonly todoRepository: Repository<Todo>,
        private readonly categoriesService: CategoriesService,
        private readonly usersService: UsersService
    ) { }

    async findAll(queryParamsDto: QueryParamsDto): Promise<Todo[]> {
        const page = queryParamsDto.page ?? 1;
        const limit = queryParamsDto.limit ?? 10;
        const startIndex = (page - 1) * limit;

        const where = queryParamsDto.priority ? { priority: queryParamsDto.priority } : {};

        let todos = await this.todoRepository.find({
            where,
            take: limit,
            skip: startIndex,
            relations: { user: true, category: true },
        });

        return todos;
    }

    async findById(id: number): Promise<Todo | undefined> {
        const todo = await this.todoRepository.findOne({ where: { id }, relations: { user: true, category: true } });

        if (!todo) {
            throw new TodoNotFoundException(id);
        }

        return todo;
    }

    async create(createTodoDto: CreateTodoDto): Promise<Todo> {
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
            const existingTodos = await this.todoRepository.findOne({ where: { title: createTodoDto.title } });
            if (existingTodos) {
                throw new BadRequestException({
                    message: `A todo with the title "${createTodoDto.title}" already exists`,
                    errorCode: 'TODO_TITLE_EXISTS',
                    field: 'title',
                    statusCode: 400
                });
            }
        }
        return this.todoRepository.save(createTodoDto);
    }

    async update(id: number, updatedTodoDto: UpdateTodoDto): Promise<Todo | undefined> {
        const todo = await this.todoRepository.findOne({ where: { id } });

        if (!todo) {
            throw new TodoNotFoundException(id);
        }

        Object.assign(todo, updatedTodoDto);
        return this.todoRepository.save(todo);
    }

    async delete(id: number) {
        const deleted = await this.todoRepository.delete(id);

        if (!deleted.affected) {
            throw new TodoNotFoundException(id);
        }
    }
}