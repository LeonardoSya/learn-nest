# nestjs

- cli创建控制器

nest g controller [name]

- logger

nestjs内置日志记录器，用于打印日志信息

```tsx
private readonly logger = new Logger(ThisClass.name). // 获取当前类名作为日志标识符
```

- 依赖注入（Dependency Injection）

nestjs的依赖注入系统会自动实例化并注入这个实例

```tsx
constructor(private configService: ConfigService) {}. // ConfigService用于读取config的服务，如PORT等
```

- NestJS 如何通过 TypeScript 的类型系统来实现依赖注入

ts的emitDecoratorMetadata（元数据反射），当编译 TypeScript 代码时，会自动生成包含类型信息的元数据

```tsx
// 这是简化版的底层实现原理
class Container {
  private providers = new Map();

  // 注册provider
  register(token: any, provider: any) {
    this.providers.set(token, provider);
  }

  // 解析依赖
  resolve(target: any) {
    // 获取构造函数的参数类型（通过TypeScript的元数据）
    const paramTypes = Reflect.getMetadata('design:paramtypes', target);
    
    // 解析每个依赖
    const dependencies = paramTypes.map((type: any) => {
      return this.providers.get(type);
    });

    // 创建实例并注入依赖
    return new target(...dependencies);
  }
}
```

- 当应用启动时，NestJS 创建一个 IoC 容器
- 扫描所有带有 @Injectable() 装饰器的类
- 通过 TypeScript 的类型元数据识别依赖关系
- 按需创建和注入实例

- @Module

将一个类标记为nestjs模块

module默认是单例，因此可以在多个模块之间共享任何提供程序的同一实例

```tsx
@Module ({
		// ... 我想在多个模块间共享CatService的实例
		providers: [CatService],
		exports: [CatService],
})
```

- @Global

模块全局化 （如数据库连接）通常在根模块、 核心模块注册

```tsx
@Global()
@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService],
})
```

- @Controller

作为api端点暴露，如果没有controller，外部应用无法通过http请求触发下载功能，controller定义method和api路由

- implements 实现

用于类实现接口，必须实现接口中的所有方法，一个类可以实现多个接口，只实现方法签名，不包含具体实现

```tsx
interface Walkable {
    walk(): void;
}

class Animal {
    name: string;
    constructor(name: string) {
        this.name = name;
    }
}

// 既继承类又实现接口
class Cat extends Animal implements Walkable {
    walk() {
        console.log(`${this.name} 在走路`);
    }
}
```

- Entity

定义数据库表结构的类

- 单例模式（nestjs forRoot()）

确保一个类只有一个实例，提供一个全局访问点，所有地方共享同一个实例

什么时候需要单例模式？

1. 数据库连接 TypeOrmModule
2. 配置 ConfigModule
3. 缓存
4. 定时任务调度器
5. 全局状态管理

如数据库连接场景：

```tsx
@Module({
	imports: [
		TypeOrmModule.forRoot({  // 不用forRoot()的话，每个模块都可能创建新的数据库连接
			type: 'pg',
			host: 'xxx',
			// ...
		})
	]
})
class AppModule {}
```

- config和定时任务配置

```tsx
const { config } = require(`./config/config.${process.env.APP_ENV}`);

// ...
ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: `${process.cwd()}/.env.${process.env.APP_ENV}`,
  load: [commonConfig, config],
}),
ScheduleModule.forRoot(),
```

- cron 定时任务

```tsx
@Injectable()
export class GroupCreateCron extends RouteService {
  _isRunning = false;

  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    if(this._isRunning) return 
    try {
      this._isRunning = true;

      // 定时任务逻辑
    } catch (error) {
      
    } finally {
      this._isRunning = false;
    }
  }
}
```