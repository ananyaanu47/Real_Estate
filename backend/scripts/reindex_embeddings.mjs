import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) {
      continue;
    }
    const separatorIndex = trimmed.indexOf('=');
    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value.replace(/^['"]|['"]$/g, '');
    }
  }
}

const prisma = new PrismaClient();

function buildPropertyEmbeddingText(property) {
  const parts = [
    property.name,
    property.status || '',
    property.price || '',
    property.location || '',
    property.propertyType || '',
    property.area || '',
    property.facing || '',
    property.landType || '',
    property.siteNo || '',
    property.description || '',
  ].filter((value) => value && String(value).trim());

  return parts.join(' | ');
}

async function generateTextEmbedding(text) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured.');
  }

  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=' + apiKey, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'models/gemini-embedding-001',
      content: { parts: [{ text }] },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Embedding API failed: ${errorText}`);
  }

  const payload = await response.json();
  const values = payload.embedding?.values;
  if (!Array.isArray(values) || values.length === 0) {
    throw new Error('Gemini returned an empty embedding.');
  }

  return values;
}

try {
  const properties = await prisma.property.findMany();
  let indexed = 0;

  for (const property of properties) {
    const text = buildPropertyEmbeddingText(property);
    if (!text.trim()) {
      continue;
    }

    const chunkText = text.length > 300 ? text.slice(0, 300) : text;
    const embedding = await generateTextEmbedding(chunkText);

    await prisma.propertyEmbedding.deleteMany({ where: { propertyId: property.id } });
    await prisma.propertyEmbedding.create({
      data: {
        propertyId: property.id,
        chunkIndex: 0,
        chunkText,
        embedding: JSON.stringify(embedding),
      },
    });

    indexed += 1;
    console.log(`indexed ${indexed}/${properties.length}: ${property.name}`);
  }

  console.log('TOTAL_INDEXED=' + indexed);
  const count = await prisma.propertyEmbedding.count();
  console.log('ROW_COUNT=' + count);
} catch (error) {
  console.error('INDEXING_ERROR=' + (error instanceof Error ? error.message : String(error)));
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
