import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
    @Get()
    greet(): string {
        return "Hello World!";
    }
}