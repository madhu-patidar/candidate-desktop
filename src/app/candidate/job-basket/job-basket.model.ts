export class AppliedJob {
    candidateStatus? : string;
    jobAppliedDate? : string | Date;
    jobCountry? : string;
    jobLocation? : string;
    jobStatus? : string;
    jobTitle? : string;
    jobcode? : string | number;
    resumeNumber? : string | number;
    
}

export class ReferralJob {
    candidateName : string;
    emailId?: string;
    jobCountry?: string;
    jobLocation?: string;
    jobPostedDate?: string | Date;
    jobStatus?: string;
    jobTitle?: string;
    jobcode?:  number | string;
    referredDate?: string | Date;
    referrerEmailId?: string;
    referrerName?: string;
    resumeNumber?: number | string;
}