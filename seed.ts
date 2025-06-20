import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Node } from './src/nodes/nodeEntity'; // Adjust this path if needed

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'nodeChallenge1',
  synchronize: true,
  entities: [Node],
});

async function seed() {
  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository(Node);

  const alphaPCName = 'AlphaPC';
  const alphaPC = repo.create({
    name: alphaPCName,
    value: { Height: 450, Width: 180 },
    path: `/${alphaPCName}`,
  });
  await repo.save(alphaPC);

  const processingName = 'Processing';
  const processing = repo.create({
    name: processingName,
    parent: alphaPC,
    value: { RAM: 32000 },
    path: `${alphaPC.path}/${processingName}`,
  });
  await repo.save(processing);

  const cpuName = 'CPU';
  const cpu = repo.create({
    name: cpuName,
    parent: processing,
    value: { Cores: 4, Power: 2.41 },
    path: `${processing.path}/${cpuName}`,
  });
  await repo.save(cpu);

  const graphicsName = 'Graphics';
  const graphics = repo.create({
    name: graphicsName,
    parent: alphaPC,
    value: { RAM: 4000, Ports: 8 },
    path: `${alphaPC.path}/${graphicsName}`,
  });
  await repo.save(graphics);

  const storageName = 'Storage';
  const storage = repo.create({
    name: storageName,
    parent: alphaPC,
    path: `${alphaPC.path}/${storageName}`,
  });
  await repo.save(storage);

  const ssdName = 'SSD';
  const ssd = repo.create({
    name: ssdName,
    parent: storage,
    value: { Capacity: 1024, WriteSpeed: 250 },
    path: `${storage.path}/${ssdName}`,
  });
  await repo.save(ssd);

  const hddName = 'HDD';
  const hdd = repo.create({
    name: hddName,
    parent: storage,
    value: { Capacity: 5120, WriteSpeed: 1.724752 },
    path: `${storage.path}/${hddName}`,
  });
  await repo.save(hdd);

  console.log('Seed completed.');
  process.exit(0);
}

seed().catch((e) => {
  console.error('Seed failed:', e);
  process.exit(1);
});
