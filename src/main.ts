import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { HttpStatus, ValidationError, ValidationPipe } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";
import { ExceptionResponse } from "./exceptions/common.exception";
import { UtilCommonTemplate } from "./utils/utils.common";
import { ValidationFilter } from "./filters/validation.filter";
import * as cookieParser from "cookie-parser";
import { HttpLogger } from "./interceptors/http-logger";
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: true,
  });

  app.enable('trust proxy');
  app.enableCors({origin: '*'});
  app.setGlobalPrefix(process.env.API_PREFIX);
  app.useGlobalInterceptors(new HttpLogger());
  app.useGlobalFilters(new ValidationFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory(errors: ValidationError[]) {
        return new ExceptionResponse(
          HttpStatus.BAD_REQUEST,
          UtilCommonTemplate.getMessageValidator(errors),
        );
      },
    }),
  );
  app.useStaticAssets(join(__dirname, '..', 'public'));

  app.use(cookieParser());
  app.set('trust proxy', true);

  const config: Omit<OpenAPIObject, "paths"> = new DocumentBuilder()
    .addBearerAuth()
    .addCookieAuth()
    .setContact('Nguyen Thanh Minh','https://github.com/ngthminhdev', 'ngthminh.dev@gmail.com' )
    .setTitle('Stock Swagger')
    .setDescription('Stock API - Talented Investor')
    .setVersion('1.0')
    .build();

  const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'Stock Swagger',
    customfavIcon: './favicon/favicon.svg'
  });

  await app.listen(parseInt(process.env.SERVER_PORT)).then((): void => {
    console.log(
      `Server is running at ${process.env.SERVER_HOST}:${process.env.SERVER_PORT} --version: 0.0.19`,
    );
  });
}

bootstrap();
