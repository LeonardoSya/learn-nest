import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Headers,
} from '@nestjs/common';

interface User {
  id: string;
  name: string;
  age: number;
  email: string;
}

@Controller('users')
export class UsersController {
  private users: User[] = [];

  @Post()
  createUser(@Body() user: User, @Headers('authorization') auth: string) {
    if (!auth) throw new Error('未授权');
    this.users.push(user);
    return {
      code: 200,
      message: '用户创建成功',
      data: user,
    };
  }

  @Get(':id')
  getUser(@Param('id') id: string, @Query('fields') fields?: string) {
    const user = this.users.find((u) => u.id === id);
    if (!user) throw new Error('用户不存在');

    if (fields) {
      const selectedFields = fields.split(',');

      return {
        code: 200,
        data: Object.fromEntries(
          Object.entries(user).filter(([key]) => selectedFields.includes(key)),
        ),
      };
    }

    return {
      code: 200,
      data: user,
    };
  }
}
