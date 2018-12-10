export class PersonalDetails {
    LOAFileName? : string;
    bgv1_sub_status? : string;
    bgv2_sub_status? : string;
    birthLocation? : string;
    contactNumber? : string;
    countyList? : CountyList[];
    dob? : string;
    fathersName? : string;
    firstName? : string;
    gender? : string;
    jobCountry? : string;
    jobCountryCode? : string;
    lastName? : string;
    locationCode? : string;
    mailId? : string;
    marital_status? : string;
    masterGenderList? : MasterGenderList[] 
    masterMarritalStatusList? : MasterMarritalStatusList[]
    relevantWorkExp? : string | number;
    residentCountry? : string;
    resumeNumber? : string | number; 
    skype_id? : string;
    workExp? : string | number;
    workedCompanies? : string | number;
}


export class CountyList {
    codesCode? : string; 
    codesDesc? : string;
}


export class MasterGenderList {
    codesCode? : string; 
    codesDesc? : string;
}

export class MasterMarritalStatusList {
    codesCode? : string; 
    codesDesc? : string;
}
