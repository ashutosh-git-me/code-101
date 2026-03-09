import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ProvenanceEngine } from '@/lib/ProvenanceEngine';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, serialNumber, manufacturer } = body;

        if (!name || !serialNumber || !manufacturer) {
            return NextResponse.json(
                { error: 'Missing required fields: name, serialNumber, manufacturer' },
                { status: 400 }
            );
        }

        // Create the product and genesis block in a transaction
        const result = await prisma.$transaction(async (tx) => {
            // 1. Create Product
            const product = await tx.product.create({
                data: {
                    Name: name,
                    Serial_Number: serialNumber,
                    Manufacturer: manufacturer,
                },
            });

            // 2. Generate Genesis Hash
            const eventType = 'Genesis';
            const previousHash = 'genesis';
            const hash = ProvenanceEngine.generateBlock(
                product.ID,
                eventType,
                {},
                previousHash
            );

            // 3. Create Genesis Ledger Entry
            const ledgerEntry = await tx.ledgerEntry.create({
                data: {
                    Product_ID: product.ID,
                    Event_Type: eventType,
                    Hash: hash,
                    Previous_Hash: previousHash,
                    Verified_By: manufacturer, // Initially verified by creator
                },
            });

            return { product, ledgerEntry };
        });

        return NextResponse.json(
            {
                message: 'Product registered successfully with genesis block.',
                product: result.product,
                genesisBlock: result.ledgerEntry,
            },
            { status: 201 }
        );
    } catch (error: any) {
        if (error.code === 'P2002') {
            return NextResponse.json(
                { error: 'A product with this Serial Number already exists.' },
                { status: 409 }
            );
        }
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
