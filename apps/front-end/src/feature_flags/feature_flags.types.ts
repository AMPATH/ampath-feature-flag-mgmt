interface FeatureFlagTypes {
    id: number;
    name: string;
    description: string;
    status: boolean;
    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
    retired: boolean;
    retiredBy: string;
    retiredDate: string;
}

export type { FeatureFlagTypes }