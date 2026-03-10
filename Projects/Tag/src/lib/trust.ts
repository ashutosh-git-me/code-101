import { PrismaClient } from '@prisma/client';
import { ProvenanceEngine } from './provenance';

const prisma = new PrismaClient();

export async function getProductTrustScore(tagId: string): Promise<number> {
    const product = await prisma.product.findUnique({
        where: { id: tagId },
        include: {
            brand: true,
            ledger: {
                orderBy: { timestamp: 'asc' }
            },
            reviews: {
                where: { isVerified: true }
            }
        }
    });

    if (!product) {
        return 0;
    }

    // 1. Hard fail if the chain has been tampered with
    const isChainValid = await ProvenanceEngine.verifyChain(product.ledger);
    if (!isChainValid) {
        return 0; // Absolute zero trust if cryptography fails
    }

    // Also fail if recalled
    if (product.status === 'RECALLED') {
        return 0;
    }

    // 2. Base score from the Brand's reputation (60% weight)
    const brandReputationScore = product.brand.trustScore * 0.6;

    // 3. Score from Verified Reviews (40% weight)
    let reviewScore = 0;
    if (product.reviews.length > 0) {
        const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
        const avgRating = totalRating / product.reviews.length;
        // Rating is out of 5. Convert to out of 40 (max weight for reviews)
        reviewScore = (avgRating / 5) * 40;
    } else {
        // If no verified reviews, assume a neutral starting point for the review portion (e.g., 20/40)
        reviewScore = 20;
    }

    const finalScore = Math.min(100, Math.round(brandReputationScore + reviewScore));
    return finalScore;
}
