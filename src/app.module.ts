import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { FilesModule } from './files/files.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { AuthModule } from './users/auth/auth.module';
import { AdoptionCentersModule } from './adoption-centers/adoption-centers.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({

      // ssl: process.env.STAGE === 'prod' ? true : false,
      // extra: {
      //   ssl: process.env.STAGE === 'prod' ? { rejectUnauthorized: false } : null
      // },
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true, // para que cargue auto las entidades que vamos creando
      synchronize: true, // en produccion no se usa
    }),
    UsersModule,
    CommonModule,
    SeedModule,
    FilesModule,
    CloudinaryModule,
    AuthModule,
    AdoptionCentersModule
   ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
