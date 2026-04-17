import { Module } from '@nestjs/common';
import { HandleExceptionsService } from './services/handle-exceptions.service';

@Module({
    providers: [HandleExceptionsService],
    exports: [HandleExceptionsService],
})
export class CommonModule {}
