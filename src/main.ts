import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { HttpStatus, ValidationError, ValidationPipe } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";
import { ExceptionResponse } from "./exceptions/common.exception";
import { UtilCommonTemplate } from "./utils/utils.common";
import { ValidationFilter } from "./filters/validation.filter";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: true,
  });
  // app.enableCors({
  //   origin: [], // add your IP whitelist here
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  //   preflightContinue: false,
  //   optionsSuccessStatus: 204,
  //   credentials: true,
  //   allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept,Authorization',
  // });

  app.enableCors({origin: '*'})

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

  await app.listen(parseInt(process.env.SERVER_PORT)).then(() => {
    console.log(
      `Server is running at ${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`,
    );
  });
}

bootstrap();
