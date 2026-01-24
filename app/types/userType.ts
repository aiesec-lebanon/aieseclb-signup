export default interface User {
    first_name: string;
    last_name: string;
    email: string;
    country_code: string;
    phone: string;
    password: string;
    country: number;
    lc: number;
    lc_input: number;
    referral_type: string;
    alignment_id: number;
    allow_phone_communication: number;
    allow_email_communication: number;
    allow_term_and_conditions: number;
    selected_programs: number[];
}