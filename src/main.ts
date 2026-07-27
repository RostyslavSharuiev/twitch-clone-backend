import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RedisStore } from 'connect-redis';
import cookieParser from 'cookie-parser';
import session from 'express-session';

import { ms, type StringValue } from '@/src/shared/utils/ms/ms.util';
import { parseBoolean } from '@/src/shared/utils/parse-boolean/parse-boolean.util';

import { CoreModule } from './core/core.module';
import { RedisService } from './core/redis/redis.service';

async function bootstrap() {
  const app = await NestFactory.create(CoreModule);
  const config = app.get(ConfigService);
  const redis = app.get(RedisService);

  app.use(cookieParser(config.getOrThrow<string>('COOKIES_SECRET')));

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.use(
    session({
      secret: config.getOrThrow<string>('SESSION_SECRET'),
      name: config.getOrThrow<string>('SESSION_NAME'),
      resave: false,
      saveUninitialized: false,
      cookie: {
        domain: config.getOrThrow<string>('SESSION_DOMAIN'),
        maxAge: ms(config.getOrThrow<StringValue>('SESSION_MAX_AGE')),
        httpOnly: parseBoolean(config.getOrThrow<string>('SESSION_HTTP_ONLY')),
        secure: parseBoolean(config.getOrThrow<string>('SESSION_SECURE')),
        sameSite: 'lax',
      },
      store: new RedisStore({
        client: redis.client,
        prefix: config.getOrThrow<string>('SESSION_FOLDER'),
      }),
    })
  );

  app.enableCors({
    origin: config.getOrThrow<string>('ALLOWED_ORIGIN'),
    credentials: true,
    exposedHeaders: ['set-cookie'],
  });

  const SWAGGER_CONFIG = new DocumentBuilder()
    .setTitle('Twitch clone app')
    .setDescription('The Twitch clone API description')
    .setVersion('1.0')
    .addTag('twitch')
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, SWAGGER_CONFIG);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(config.getOrThrow<number>('APPLICATION_PORT'));
}

void bootstrap();
