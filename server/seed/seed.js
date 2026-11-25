
import { MongoClient } from 'mongodb';
import { EJSON } from 'bson'; 
import { readFile } from 'node:fs/promises';
import 'dotenv/config';

const URI = process.env.MONGO_URI;
const client = new MongoClient(URI);

const collections = ['Botellas', 'Cocktails'];

async function seedDatabase() {
  try {
    await client.connect();

    const db = client.db('Partytime');

    for (const collectionName of collections) {
      const filePath = new URL(
        `./data/${collectionName}.json`,
        import.meta.url
      );

      const file = await readFile(filePath, 'utf-8');
      const documents = EJSON.parse(file);

      await db.collection(collectionName).deleteMany({});

      if (documents.length > 0) {
        await db.collection(collectionName).insertMany(documents);
      }

      console.log(
        `${collectionName}: ${documents.length} documents imported`
      );
    }

    console.log('Partytime database successfully seeded!');
  } catch (error) {
    console.error('Seed error:', error);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

seedDatabase();
