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
}