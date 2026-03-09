import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ProvenanceEngine } from '@/lib/ProvenanceEngine';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { productId, eventType, verifiedBy, metadata } = body;

        if (!productId || !eventType || !verifiedBy) {
            return NextResponse.json(
                { error: 'Missing required fields: productId, eventType, verifiedBy' },
                { status: 400 }
            );
        }

        // Use a transaction to ensure we read the latest block and add the new one atomically
        const newEntry = await prisma.$transaction(async (tx) => {
            // 1. Verify product exists
            const product = await tx.product.findUnique({
                where: { ID: productId },
            });

            if (!product) {
                throw new Error('PRODUCT_NOT_FOUND');
            }

            // 2. Get the latest ledger entry to act as the previous block
            const latestEntry = await tx.ledgerEntry.findFirst({
                where: { Product_ID: productId },
                orderBy: { Timestamp: 'desc' },
            });

            if (!latestEntry) {
                throw new Error('NO_GENESIS_BLOCK');
            }

            // 3. Calculate new hash
            const previousHash = latestEntry.Hash;
            const timestamp = new Date();
            const nonce = crypto.randomBytes(16).toString('hex');
            const metadataOpt = metadata || null;

            const hash = ProvenanceEngine.generateBlock(
                productId,
                eventType,
                metadataOpt,
                previousHash,
                timestamp,
                nonce,
                verifiedBy
            );

            // 4. Create new ledger entry
            const ledgerEntry = await tx.ledgerEntry.create({
                data: {
                    Product_ID: productId,
                    Timestamp: timestamp,
                    Event_Type: eventType,
                    Metadata: metadataOpt,
                    Nonce: nonce,
                    Hash: hash,
                    Previous_Hash: previousHash,
                    Verified_By: verifiedBy,
                },
            });

            return ledgerEntry;
        });

        return NextResponse.json(
            {
                message: 'Ledger updated successfully.',
                ledgerEntry: newEntry,
            },
            { status: 201 }
        );
    } catch (error: any) {
        if (error.message === 'PRODUCT_NOT_FOUND') {
            return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
        }
        if (error.message === 'NO_GENESIS_BLOCK') {
            return NextResponse.json({ error: 'Ledger corruption: No genesis block found for product.' }, { status: 400 });
        }
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
