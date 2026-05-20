import * as fs from 'fs';
import * as path from 'path';
import { Todo } from 'src/todos/entities/todo.entity';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { CreateTodoDto } from './dto/create-todo.dto';
import { TodoStatus } from './enum/todo-status.enum';
import { TodoPriority } from './enum/todo-priority.enum';
import { Injectable } from '@nestjs/common';

const TODOS_FILE = path.join(__dirname, 'todos.json');

@Injectable()
export class TodoRepository {
    private readFromFile(): Todo[] {
        const data = fs.readFileSync(TODOS_FILE, 'utf-8');
        return JSON.parse(data) as Todo[];
    }
    private writeToFile(todos: Todo[]): void {
        fs.writeFileSync(TODOS_FILE, JSON.stringify(todos, null, 2), 'utf-8');
    }

    private getNextId(todos: Todo[]): number {
        return todos.length > 0 ? Math.max(...todos.map(todo => todo.id)) + 1 : 1;
    }

    findAll(): Todo[] { return this.readFromFile(); }

    findById(id: number): Todo | undefined {
        const todos = this.readFromFile();
        return todos.find(todo => todo.id === id);
    }

    create(createTodoDto: CreateTodoDto): Todo {
        const todos = this.readFromFile();
        const newTodo: Todo = {
            id: this.getNextId(todos),
            title: createTodoDto.title ?? '',
            description: createTodoDto.description ?? '',
            status: createTodoDto.status ?? TodoStatus.OPEN,
            priority: createTodoDto.priority ?? TodoPriority.MEDIUM,
            categoryId: createTodoDto.categoryId ?? 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        todos.push(newTodo);
        this.writeToFile(todos);
        return newTodo;
    }

    update(id: number, updatedTodoDto: UpdateTodoDto): Todo | undefined {
        const todos = this.readFromFile();
        const todoIndex = todos.findIndex(todo => todo.id === id);
        if (todoIndex === -1) return undefined;
        todos[todoIndex] = { ...todos[todoIndex], ...updatedTodoDto, updatedAt: new Date() };
        this.writeToFile(todos);
        return todos[todoIndex];
    }

    delete(id: number): boolean {
        const todos = this.readFromFile();
        const todoIndex = todos.findIndex(todo => todo.id === id);
        if (todoIndex === -1) return false;
        todos.splice(todoIndex, 1);
        this.writeToFile(todos);
        return true;
    }

}