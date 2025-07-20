import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import * as session from 'express-session';
import passport from './passport-config';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);

  // Configure express-session middleware
  app.use(
    session({
      secret: 'yourSecretKey', // Replace with a secure key
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 3600000 }, // 1 hour
    }),
  );

  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());



  await app.listen(3000);
}

bootstrap();
