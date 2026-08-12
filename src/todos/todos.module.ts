import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TodosController } from './todos.controller';
import { TodoService } from './todos.service';
import { CategoriesModule } from 'src/categories/categories.module';
import { UsersModule } from 'src/users/users.module';
import { Todo } from './entities/todo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { requestIdMiddleware } from 'src/common/middleware/request-id.middleware';

@Module({
  controllers: [TodosController],
  providers: [TodoService],
  exports: [TodoService],
  imports: [CategoriesModule, UsersModule, TypeOrmModule.forFeature([Todo])],
})
export class TodosModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(requestIdMiddleware).forRoutes('todos');
  // }
}
