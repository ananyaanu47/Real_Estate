import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.property.createMany({
    data: [
      {
        name: 'Modern Villa',
        status: 'Available',
        price: '₹95L',
        location: 'Bangalore',
        propertyType: 'Villa',
        description: 'Bright villa with premium finishes.'
      },
      {
        name: 'Downtown Apartment',
        status: 'Reserved',
        price: '₹72L',
        location: 'Hyderabad',
        propertyType: 'Apartment',
        description: 'Central apartment with modern amenities.'
      }
    ]
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
