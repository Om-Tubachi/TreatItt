export interface FrpShape {
    composition?: { composition_name: string };
    category?: { category_name: string };
    grade?: { grade_name: string };
    resin?: { resin_name: string };
}

export interface ProductEntity {
    id: string;
    price?: number;
    quantity?: number;
    form?: string;
    date?: string;
    frp?: FrpShape;
    users?: { id: string; username: string };
}

export interface WasteEntity {
    id: string;
    quantity?: number;
    price_per_kg?: number;
    form?: string;
    date?: string;
    lifecycle_stage?: string;
    status?: string;
    frp?: FrpShape;
    users?: { id: string; username: string };
}

export interface RequirementEntity {
    id: string;
    est_req_per_month?: number;
    act_req_per_month?: number;
    price_per_kg?: number;
    urgency?: string;
    status?: string;
    date?: string;
    frp?: FrpShape;
    users?: { id: string; username: string; first_name?: string; last_name?: string; company_name?: string };
}

export interface RecyclingEntity {
    id: string;
    capacity_kg?: number;
    charges?: number;
    schedules?: string;
    treatments?: {
        treatment_processes?: {
            process?: string;
            treatment_methods?: { method: string };
        };
    };
}