import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    // DatabaseModule,

    // UsersModule,
    // AuthModule,

    // ...(process.env.NODE_ENV === 'development' ? [SeederModule] : []),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
