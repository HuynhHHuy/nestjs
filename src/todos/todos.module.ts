import { Module } from '@nestjs/common';
import { TodosController } from './todos.controller';
import { TodoService } from './todos.service';
import { TodoRepository } from './todos.repository';
import { CategoriesModule } from 'src/categories/categories.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [TodosController],
  providers: [TodoService, TodoRepository],
  exports: [TodoService, TodoRepository],
  imports: [CategoriesModule, UsersModule],
})
export class TodosModule { }
