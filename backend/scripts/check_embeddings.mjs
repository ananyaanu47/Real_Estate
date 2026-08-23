import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

try {
  const rows = await prisma.propertyEmbedding.findMany({
    take: 3,
    include: { property: true },
  });

  console.log('embedding_rows=' + rows.length);
  if (rows[0]) {
    console.log('sample=' + JSON.stringify({
      id: rows[0].id,
      propertyId: rows[0].propertyId,
      name: rows[0].property.name,
      chunk: rows[0].chunkText.slice(0, 80),
      embeddingLength: rows[0].embedding.length,
    }));
  }
} finally {
  await prisma.$disconnect();
}
