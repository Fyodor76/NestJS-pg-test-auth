import {forwardRef, Module} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {JwtModule} from "@nestjs/jwt";
import * as process from "process";
import {UsersModule} from "../users/users.module";

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [
      forwardRef(() => UsersModule),
      JwtModule.register({
        secret: process.env.PRIVATE_KEY || "Secret",
        signOptions: {
          expiresIn: '24h'
        }
      })
  ],
    exports: [AuthService, JwtModule]
})
export class AuthModule {}
