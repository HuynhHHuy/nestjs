import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    private users: User[] = [
        { id: 1, username: 'john_doe', todos: [] },
        { id: 2, username: 'jane_doe', todos: [] },
    ];

    findById(id: number) {
        return this.users.find(user => user.id === id);
    }
}
