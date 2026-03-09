/**
 * Strict TypeScript interfaces defining the off-chain JSON schema 
 * requirements for various tracking industries.
 */

export interface BhopalOrganicHoney {
    origin_farm: string;
    pesticide_level: number;
    harvest_date: string;
    organic_cert_id: string;
}

export interface LuxuryWatch {
    model_name: string;
    movement_type: string;
    assembly_location: string;
    warranty_expiry: string;
}

export interface PharmaMedicine {
    batch_no: string;
    storage_temp_min: number;
    storage_temp_max: number;
    expiry_date: string;
}

// Utility type for the Product model's Metadata field
export type ProductMetadata = BhopalOrganicHoney | LuxuryWatch | PharmaMedicine;
