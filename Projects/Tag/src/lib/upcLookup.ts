// src/lib/marketApi.ts

interface UpcResponse {
    isValid: boolean;
    product?: {
        upc: string;
        title: string;
        brand: string;
        category: string;
        description: string;
        image: string;
    };
    error?: string;
}

export async function fetchUpcDetails(upc: string): Promise<UpcResponse> {
    try {
        console.log(`Fetching UPC data for: ${upc}`);

        // Using the free trial tier of UPCitemdb
        // Rate limit: 100 requests / day
        const response = await fetch(`https://api.upcitemdb.com/prod/trial/lookup?upc=${upc}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            // next: { revalidate: 86400 } // heavily cache UPC lookups if we were using next fetch
        });

        if (!response.ok) {
            console.error(`UPC API Error: ${response.status}`);
            return { isValid: false, error: 'API Error' };
        }

        const data = await response.json();

        if (data.code === 'OK' && data.items && data.items.length > 0) {
            const item = data.items[0];

            return {
                isValid: true,
                product: {
                    upc: item.upc,
                    title: item.title || 'Unknown Product',
                    brand: item.brand || 'Generic Brand',
                    category: item.category || 'General',
                    description: item.description || '',
                    image: item.images && item.images.length > 0 ? item.images[0] : ''
                }
            };
        } else {
            console.log("UPC not found in database.");
            return { isValid: false, error: 'Not Found' };
        }

    } catch (error: any) {
        console.error(`UPC Lookup Failed: ${error.message}`);
        return { isValid: false, error: error.message };
    }
}
