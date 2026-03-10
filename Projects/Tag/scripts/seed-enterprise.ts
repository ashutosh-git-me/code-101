import { PrismaClient } from '@prisma/client';
import { generateHash } from '../src/lib/provenance';

const prisma = new PrismaClient();
const nanoid = (size = 21) => crypto.randomUUID().replace(/-/g, '').slice(0, size);

async function seed() {
    console.log('--- Massive Seeding: The Enterprise Tag ---');
    console.log('Cleaning existing database...');
    await prisma.ledgerEntry.deleteMany({});
    await prisma.component.deleteMany({});
    await prisma.review.deleteMany({});
    await prisma.productInstance.deleteMany({});
    await prisma.productModel.deleteMany({});
    await prisma.brand.deleteMany({});

    console.log('Generating 5 Brands...');
    const brandsData = [
        { id: `b_${nanoid(8)}`, name: 'Bhopal Eco', industry: 'Food', trustScore: 99.0 },
        { id: `b_${nanoid(8)}`, name: 'Tesla-Clone', industry: 'Automotive', trustScore: 85.5 },
        { id: `b_${nanoid(8)}`, name: 'Rolex-Clone', industry: 'Luxury', trustScore: 50.0 },
        { id: `b_${nanoid(8)}`, name: 'Pfizer-Clone', industry: 'Pharma', trustScore: 92.0 },
        { id: `b_${nanoid(8)}`, name: 'Generic Ltd', industry: 'Retail', trustScore: 70.0 }
    ];

    await prisma.brand.createMany({ data: brandsData });
    const brands = await prisma.brand.findMany();

    console.log('Generating 10 Product Models...');
    const modelsData = [
        { brandId: brands.find(b => b.name === 'Bhopal Eco')!.id, name: 'Bhopal Honey', category: 'Food', base_price: 500 },
        { brandId: brands.find(b => b.name === 'Bhopal Eco')!.id, name: 'Bhopal Wheat', category: 'Food', base_price: 1500 },
        { brandId: brands.find(b => b.name === 'Tesla-Clone')!.id, name: 'Model X-C', category: 'Automotive', base_price: 5000000 },
        { brandId: brands.find(b => b.name === 'Tesla-Clone')!.id, name: 'Model Y-C', category: 'Automotive', base_price: 3500000 },
        { brandId: brands.find(b => b.name === 'Rolex-Clone')!.id, name: 'Submariner-C', category: 'Luxury', base_price: 250000 },
        { brandId: brands.find(b => b.name === 'Rolex-Clone')!.id, name: 'Daytona-C', category: 'Luxury', base_price: 450000 },
        { brandId: brands.find(b => b.name === 'Pfizer-Clone')!.id, name: 'Vaccine-C19', category: 'Pharma', base_price: 800 },
        { brandId: brands.find(b => b.name === 'Pfizer-Clone')!.id, name: 'Antibiotic-Z', category: 'Pharma', base_price: 1200 },
        { brandId: brands.find(b => b.name === 'Generic Ltd')!.id, name: 'Smart TV 55', category: 'Electronics', base_price: 35000 },
        { brandId: brands.find(b => b.name === 'Generic Ltd')!.id, name: 'Sneakers Pro', category: 'Fashion', base_price: 12000 }
    ];

    for (let i = 0; i < modelsData.length; i++) {
        await prisma.productModel.create({
            data: modelsData[i]
        });
    }

    const models = await prisma.productModel.findMany({ include: { brand: true } });

    console.log('Generating 1,000 Product Instances (The Identical Twins)...');
    console.log('This involves creating the instance and its Genesis block and hashing it. Please wait.');

    const instancesData: any[] = [];
    const ledgerData: any[] = [];

    // Distribute 1,000 instances evenly across 10 models (100 each)
    const TIMESTAMP = new Date();

    for (const model of models) {
        for (let i = 0; i < 100; i++) {
            const instanceId = `tag_${nanoid(16)}`;

            instancesData.push({
                id: instanceId,
                productModelId: model.id,
                currentOwner: model.brandId,
                status: 'Manufactured'
            });

            const genesisHash = generateHash({
                eventType: 'MANUFACTURE',
                metadata: `Initial Minting of ${model.name}`,
                price: model.base_price,
                ownerId: model.brandId,
                prevHash: 'GENESIS',
                timestamp: TIMESTAMP
            });

            ledgerData.push({
                productId: instanceId,
                eventType: 'MANUFACTURE',
                price: model.base_price,
                ownerId: model.brandId,
                metadata: `Initial Minting of ${model.name}`,
                hash: genesisHash,
                prevHash: 'GENESIS',
                timestamp: TIMESTAMP
            });
        }
    }

    // Using transaction for bulk insert of Instances
    console.log(`Inserting ${instancesData.length} instances in bulk...`);
    // Split into chunks if too large, SQLite handles 1000 fine in one go.
    await prisma.$transaction([
        prisma.productInstance.createMany({ data: instancesData }),
        prisma.ledgerEntry.createMany({ data: ledgerData })
    ]);

    console.log('Seeding Complete! Summary:');
    console.log('  - 5 Brands created');
    console.log('  - 10 Product Models created');
    console.log('  - 1,000 Product Instances created and hashed');
    console.log('--- The Enterprise Tag Test Data is ready ---');
}

seed()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });
