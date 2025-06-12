import { AffirmationCategory, PrismaClient } from '@prisma/client';
import { affirmations } from './affirmations';

const prisma = new PrismaClient();
const seedDatabase = async (): Promise<void> => {
  await prisma.$connect();

  try {
    console.log('🌱 Starting database seeding.');

    const existingCount = await prisma.affirmation.count();

    if (existingCount > 0) {
      console.log('✅ Affirmations already exist, skipping seeding.');

      return;
    }

    const records: {
      text: string;
      category: AffirmationCategory;
      language: string;
      isPublic: boolean;
      isApproved: boolean;
    }[] = [];

    for (const language of Object.keys(
      affirmations,
    ) as (keyof typeof affirmations)[]) {
      const categories = affirmations[language];

      for (const categoryKey of Object.keys(
        categories,
      ) as AffirmationCategory[]) {
        const texts = categories[categoryKey];

        for (const text of texts) {
          records.push({
            text,
            category: categoryKey,
            language,
            isPublic: true,
            isApproved: true,
          });
        }
      }
    }

    await prisma.affirmation.createMany({ data: records });
    console.log(`✅ Seeded ${records.length} affirmations.`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
    console.log('🌾 Database seeding complete.');
  }
};

void seedDatabase();
