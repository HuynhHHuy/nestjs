import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Todo } from "src/todos/entities/todo.entity";
import { QueryParamsDto } from "./dto/query-params.dto";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { UpdateTodoDto } from "./dto/update-todo.dto";
import { CategoriesService } from 'src/categories/categories.service';
import { UsersService } from 'src/users/users.service';
import { TodoNotFoundException } from './exceptions/todo-not-found.exception';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { TODOS_CONFIG, type TodosConfig } from 'src/types/todos';

@Injectable()
export class TodoService {

    constructor(
        @InjectRepository(Todo) //huong dan NestJS inject repository tu TypeORM
        private readonly todoRepository: Repository<Todo>,
        private readonly categoriesService: CategoriesService,
        private readonly usersService: UsersService,
        private readonly dataSource: DataSource,

        @Inject(TODOS_CONFIG) private readonly config: TodosConfig,
    ) { }

    async findAll(queryParamsDto: QueryParamsDto): Promise<Todo[]> {
        const page = queryParamsDto.page ?? 1;
        const limit = queryParamsDto.limit ?? this.config.defaultPageSize;
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
        const user = await this.usersService.findById(createTodoDto.userId);
        if (!user) {
            throw new NotFoundException({
                message: `User with ID ${createTodoDto.userId} not found`,
                errorCode: 'USER_NOT_FOUND',
                field: 'userId',
                statusCode: 404
            });
        }

        if (createTodoDto.categoryId) {
            const category = await this.categoriesService.findById(createTodoDto.categoryId);
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
        return this.dataSource.transaction(async (manager) => {
            const todo = await manager.create(Todo, createTodoDto);
            await manager.update(User, createTodoDto.userId, { lastActivityAt: new Date() });
            return todo;
        });
    }

    async update(id: number, updatedTodoDto: UpdateTodoDto): Promise<Todo | undefined> {
        if (updatedTodoDto.categoryId) {
            const category = await this.categoriesService.findById(updatedTodoDto.categoryId);
            if (!category) {
                throw new NotFoundException({
                    message: `Category with ID ${updatedTodoDto.categoryId} not found`,
                    errorCode: 'CATEGORY_NOT_FOUND',
                    field: 'categoryId',
                    statusCode: 404
                });
            }
        }

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