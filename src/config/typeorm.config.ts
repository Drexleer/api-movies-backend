import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';

export const typeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const databaseUrl = configService.get<string>('DATABASE_URL');
  if (databaseUrl) {
    return {
      type: 'postgres',
      url: databaseUrl,
      entities: [],
      synchronize: true,
      autoLoadEntities: true,
      logging: false,
      ssl:
        databaseUrl.includes('sslmode=require') ||
        databaseUrl.includes('ssl=true'),
      dropSchema: false,
    } as DataSourceOptions;
  }
  return {
    type: 'postgres',
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_NAME'),
    entities: [],
    synchronize: true,
    autoLoadEntities: true,
    logging: false,
    ssl: false,
    dropSchema: false,
  };
};
