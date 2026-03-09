import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ProvenanceEngine } from '@/lib/ProvenanceEngine';
import crypto from 'crypto';
import { nanoid } from 'nanoid';

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
            const productId = nanoid(12);

            // Extract remaining body fields as potential metadata (origin, batch, description)
            const { name: _n, serialNumber: _s, manufacturer: _m, ...rest } = body;
            const productMetadataStr = Object.keys(rest).length > 0 ? JSON.stringify(rest) : null;

            // 1. Create Product
            const product = await tx.product.create({
                data: {
                    ID: productId,
                    Name: name,
                    Serial_Number: serialNumber,
                    Manufacturer: manufacturer,
                    Metadata: productMetadataStr,
                },
            });

            // 2. Generate Genesis Hash
            const eventType = 'Genesis';
            const previousHash = '0';
            const timestamp = new Date();
            const nonce = crypto.randomBytes(16).toString('hex');
            const metadataStr = `Manufacturer: ${manufacturer}`;

            // Mix the product's off-chain metadata into the Genesis Block hash
            const combinedMetadata = productMetadataStr
                ? `${metadataStr} | ProductMeta: ${productMetadataStr}`
                : metadataStr;

            const hash = ProvenanceEngine.generateBlock(
                product.ID,
                eventType,
                combinedMetadata,
                previousHash,
                timestamp,
                nonce,
                manufacturer
            );

            // 3. Create Genesis Ledger Entry
            const ledgerEntry = await tx.ledgerEntry.create({
                data: {
                    Product_ID: product.ID,
                    Timestamp: timestamp,
                    Event_Type: eventType,
                    Metadata: combinedMetadata,
                    Nonce: nonce,
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
