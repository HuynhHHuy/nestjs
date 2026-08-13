import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TodosController } from './todos.controller';
import { TodoService } from './todos.service';
import { CategoriesModule } from 'src/categories/categories.module';
import { UsersModule } from 'src/users/users.module';
import { Todo } from './entities/todo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { requestIdMiddleware } from 'src/common/middleware/request-id.middleware';
import { TODOS_CONFIG } from 'src/types/todos';

@Module({
  controllers: [TodosController],
  providers: [
    TodoService,
    {
      provide: TODOS_CONFIG,
      useValue: {
        defaultPageSize: process.env.NODE_ENV === 'development' ? 10 : 20,
        maxTodosPerUser: 100,
        maxTitleLength: 200,
      },
    }
  ],
  exports: [TodoService],
  imports: [CategoriesModule, UsersModule, TypeOrmModule.forFeature([Todo])],
})
export class TodosModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(requestIdMiddleware).forRoutes('todos');
  // }
}
