import { Body, Controller, Delete, Get, Headers, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto/update-todo.dto';
import { QueryParamsDto } from './dto/query-params.dto/query-params.dto';

@Controller('todos')
export class TodosController {
    @Get()
    findAll(
        @Query() queryParamsDto: QueryParamsDto
    ) {
        return `Lay todos voi quality: ${queryParamsDto.priority}, limit: ${queryParamsDto.limit}, page: ${queryParamsDto.page}`;
    }

    @Get(':id')
    getById(@Param() params: { id: string }): string {
        return `This action returns the todo with ID: ${params.id}`;
    }

    @Post()
    create(@Body() CreateTodoDto: CreateTodoDto, @Headers('authorization') auth: string) {
        if (auth) {
            return `This action creates a new todo with the following data: ${JSON.stringify(CreateTodoDto.title)} and authorization header: ${auth}`;
        }
        return "Vui long cung cap header authorization";
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() UpdateTodoDto: UpdateTodoDto) {
        return `This action updates the todo with ID: ${id} with the following data: ${JSON.stringify(UpdateTodoDto)}`;
    }

    @HttpCode(204)
    @Delete(':id')
    delete(@Param('id') id: string) {
        return `This action deletes the todo with ID: ${id}`;
    }
}
