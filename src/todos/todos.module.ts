import { Module } from '@nestjs/common';
import { TodosController } from './todos.controller';
import { TodoService } from './todos.service';
import { TodoRepository } from './todos.repository';

@Module({
  controllers: [TodosController],
  providers: [TodoService, TodoRepository],
  exports: [TodoService, TodoRepository],
})
export class TodosModule { }
