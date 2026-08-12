import { Body, Controller, Delete, Get, Headers, HttpCode, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { QueryParamsDto } from './dto/query-params.dto';
import { TodoService } from './todos.service';
import { TodoOwnershipGuard } from './guards/todo-ownership.guard';

@Controller('todos')
export class TodosController {

    constructor(private todosService: TodoService) { }

    @Get()
    findAll(
        @Query() queryParamsDto: QueryParamsDto
    ) {
        return this.todosService.findAll(queryParamsDto);
    }

    @Get(':id')
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
