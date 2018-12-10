import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class MyProfileService {

  constructor(
    private datePipe : DatePipe
  ) { }

  getInput(personalDetails?, accountDetails?, entityIds?, displayName?, flag?){
    let input = {
        "inputs":{ 
            "resumeNumber": personalDetails.resumeNumber.toString(),
            "companyCode":"WT",
            "userLevel":"12",
            "status":"SAVED",
            "moduleType":"lateral",
            "typeCheck":accountDetails.typeOfCheck,
            "userId": personalDetails.resumeNumber.toString(),
            "division":accountDetails.division,
            "subdivision":accountDetails.subdivision,
            "accountCode":accountDetails.accountCode,
            "location": personalDetails.locationCode.toString(),
            "countryCode": personalDetails.jobCountryCode.toString(),
            "workCompy": personalDetails.workedCompanies.toString(),
            "submittedValue":"Saved",
            "entityName":displayName,
            "maritalStatus": personalDetails.marital_status.toString(),
            "DOB": this.datePipe.transform(personalDetails.dob, 'dd-MM-yyyy'),
            "subEntityDetails":
            [
                {
                "subEntity":[],
                "entityId":entityIds.toString(),
                "enFlag":flag === 'enFlag' ? 'Y': 'N',
                "edFlag":flag === 'edFlag' ? 'Y': 'N',
                "addressCheckInd": personalDetails.jobCountryCode === 'IND' ? "Y" : "N",
                "addressType":'',
                }
            ],
            "gapDetails":[],
            "selfEmployment":"N",
            "selfEmpArr":[],
            "fileArray":[],
            "addressOthArray":[],
            "bgv1Status":JSON.stringify(personalDetails.bgv1_sub_status) ==='' || JSON.stringify(personalDetails.bgv1_sub_status) ==='{}' ? 'SAVED' : personalDetails.bgv1_sub_status,
            "bgv2Status":JSON.stringify(personalDetails.bgv2_sub_status) ==='' || JSON.stringify(personalDetails.bgv2_sub_status) ==='{}' ? 'SAVED' : personalDetails.bgv2_sub_status,
            "workExp":personalDetails.workExp.toString(),
            "relWorkExp":personalDetails.relevantWorkExp.toString(),
        }
    }
    return input;
}
}
