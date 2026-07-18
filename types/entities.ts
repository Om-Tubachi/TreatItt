import { MetricFieldSchema } from './formTemplates';

export interface FrpShape {
    id?: string;
    composition_id?: string;
    category_id?: string;
    grade_id?: string;
    resin_id?: string;
    composition?: { composition_name: string; composition_description?: string };
    category?: { category_name: string };
    grade?: { grade_name: string };
    resin?: { resin_name: string };
    createdat?: string;
    updatedat?: string;
}

export interface ProductEntity {
    id: string;
    user_id?: string;
    frp_id?: string;
    price?: number;
    quantity?: number;
    form?: string;
    date?: string;
    metrics?: Record<string, any>;
    form_template_id?: string | null;
    createdat?: string;
    updatedat?: string;
    frp?: FrpShape;
    users?: { id: string; username: string };
}

export interface WasteEntity {
    id: string;
    user_id?: string;
    frp_id?: string;
    quantity?: number;
    price_per_kg?: number;
    form?: string;
    date?: string;
    lifecycle_stage?: string;
    status?: string;
    metrics?: Record<string, any>;
    form_template_id?: string | null;
    createdat?: string;
    updatedat?: string;
    frp?: FrpShape;
    users?: { id: string; username: string };
    collectors?: { id: string; address?: string } | null;
    manufacturing_processes?: {
        id: string;
        manufacturing_process_name?: string;
        users?: { id: string; username: string };
    } | null;
}

export interface RequirementEntity {
    id: string;
    user_id?: string;
    frp_id?: string;
    est_req_per_month?: number;
    act_req_per_month?: number;
    price_per_kg?: number;
    urgency?: string;
    status?: string;
    date?: string;
    metrics_range?: Record<string, { min?: number; max?: number }>;
    form_template_id?: string | null;
    createdat?: string;
    updatedat?: string;
    frp?: FrpShape;
    users?: {
        id: string;
        username: string;
        first_name?: string;
        last_name?: string;
        company_name?: string;
    };
}

export interface TreatmentMethod {
    id: string;
    method: string;
    process_parameter_schema?: MetricFieldSchema[] | null;
}

export interface TreatmentProcess {
    id: string;
    treatment_method_id?: string;
    process?: string;
    treatment_methods?: TreatmentMethod;
}

export interface TreatmentRelation {
    id: string;
    treatment_process_id?: string;
    treatment_processes?: TreatmentProcess;
}

export interface RecyclingEntity {
    id: string;
    user_id?: string;
    treatment_id?: string;
    capacity_kg?: number;
    charges?: number;
    schedules?: string;
    process_details?: Record<string, any> | null;
    accepted_form_ids?: string[] | null;
    capability_metrics?: Record<string, any> | null;
    createdat?: string;
    updatedat?: string;
    treatments?: TreatmentRelation;
    recyclers?: {
        id: string;
        address?: string;
        users?: { id: string; username: string; first_name?: string; last_name?: string; company_name?: string };
    };
}

export interface User {
    id: string;
    username: string;
    first_name: string;
    middle_name?: string;
    last_name: string;
    company_name?: string;
    designation?: string;
    email: string;
    contact_number?: string;
    frp_industry_id?: string;
    address?: string;
    google_id?: string;
    is_verified?: boolean;
}

export interface SignUpData {
    username: string;
    fname: string;
    mname?: string;
    lname: string;
    companyName?: string;
    designation?: string;
    email: string;
    contactNum?: string;
    frpIndustryId: string;
    address?: string;
    password: string;
    latitude?: number;
    longitude?: number;
}

export interface GoogleSignUpData {
    username: string;
    fname: string;
    mname?: string;
    lname: string;
    companyName?: string;
    designation?: string;
    email: string;
    contactNum?: string;
    frpIndustryId: string;
    address?: string;
    accessToken: string;
    latitude?: number;
    longitude?: number;
}