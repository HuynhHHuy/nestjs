import { Body, Controller, Delete, Get, Headers, HttpCode, Param, ParseIntPipe, Patch, Post, Query, SerializeOptions, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { QueryParamsDto } from './dto/query-params.dto';
import { TodoService } from './todos.service';
import { TodoOwnershipGuard } from './guards/todo-ownership.guard';
import { TimingInterceptor } from 'src/common/interceptors/timing.interceptor';
import { GROUP_USER_BASIC, GROUP_USER_DETAIL } from 'src/users/entities/user.entity';

@Controller('todos')
export class TodosController {

    constructor(private todosService: TodoService) { }

    @Get()
    @UseInterceptors(TimingInterceptor)
    @SerializeOptions({
        groups: [GROUP_USER_BASIC]
    })
    findAll(
        @Query() queryParamsDto: QueryParamsDto
    ) {
        return this.todosService.findAll(queryParamsDto);
    }

    @Get(':id')
    @SerializeOptions({
        groups: [GROUP_USER_DETAIL]
    })
    getById(@Param('id', ParseIntPipe) id: number) {
        return this.todosService.findById(id);
    }

    @Post()
    create(@Body() CreateTodoDto: CreateTodoDto, @Headers('authorization') auth: string) {
        return this.todosService.create(CreateTodoDto);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() UpdateTodoDto: UpdateTodoDto) {
        return this.todosService.update(id, UpdateTodoDto);
    }

    @HttpCode(204)
    @Delete(':id')
    @UseGuards(TodoOwnershipGuard)
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.todosService.delete(id);
    }
}
