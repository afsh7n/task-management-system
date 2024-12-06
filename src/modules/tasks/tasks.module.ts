import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksController } from './controllers/tasks.controller';
import { TasksService } from './services/tasks.service';
import { TaskEntity } from './entities/task.entity';
import { AuthModule } from '../auth/auth.module';
import {UserModule} from "../user/user.module";

@Module({
    imports: [TypeOrmModule.forFeature([TaskEntity]), AuthModule,UserModule],
    controllers: [TasksController],
    providers: [TasksService],
})
export class TasksModule {}
