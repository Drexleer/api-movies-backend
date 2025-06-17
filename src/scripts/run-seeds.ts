import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { SeedService } from '../config/seed.service';

async function runSeeds() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seedService = app.get(SeedService);

  try {
    console.log('🌱 Ejecutando seeds manuales...');
    await seedService.runAllSeeds();
    console.log('✅ Seeds ejecutados exitosamente');
  } catch (error) {
    console.error('❌ Error ejecutando seeds:', (error as Error).message);
    process.exit(1);
  } finally {
    await app.close();
  }
}

runSeeds().catch((error) => {
  console.error('❌ Error fatal ejecutando seeds:', error);
  process.exit(1);
});
