import { environment } from './../environments/environment';

export const BASE_URL = environment.baseUrl

// synergy APIs
export const INERVIEW_DETIALS_URL = BASE_URL + '/services/rest/onboarding/cd/get';
export const CANDIDATE_DETIALS_URL = BASE_URL + '/services/rest/onboarding/cd/get';
export const NOTIFICATIONS_URL = BASE_URL + '/services/rest/onboarding/cd/get';
export const INERVIEW_SUBMISSION_URL = BASE_URL + '/services/rest/onboarding/cd/update';
export const SOURCE_CONFIRMATION_URL = BASE_URL + '/services/rest/onboarding/cd/update';
export const PENDING_TASK_URL = BASE_URL + '/services/rest/onboarding/cd/get'


//photo APIs
export const UPLOAD_PHOTO_URL = BASE_URL + '/iverify/rest/uploadService/profilePicUpload';
export const GET_PHOTO_URL = BASE_URL + '/iverify/rest/bgvresumedocdetails/profilePic/';


export const PATTERN_LOADING_DATA_URL = BASE_URL + "/iverify/rest/bgvForm/bgvPattern"
export const FILE_UPLOAD_URL = BASE_URL + '/iverify/rest/uploadService/uploadFile';
export const ENTITY_SAVE_URL = BASE_URL + '/iverify/rest/bgvActionService/Save';
export const FINAL_SUBMISSION_URL = BASE_URL + '/iverify/rest/bgvActionService/Submit';

//Job details APIs

export const JOB_DETAILS_URL = BASE_URL +"/ResumePosting/CareerAppServices?";
// export const JOB_DETAILS_URL = 'https://synergy.wipro.com' +"/ResumePosting/CareerAppServices?";

//'https://appstore.wipro.com'
//ResumePosting
//synergy
export const RECOMMENDED_JOBS_URL =  BASE_URL + '/services/rest/onboarding/cd/get'

export const APPLIED_JOB_URL = BASE_URL + '/services/rest/onboarding/cd/get';
export const REFERRAL_JOB_URL = BASE_URL + '/services/rest/onboarding/cd/get';

// Referral Jobs

//Social networks APIs

export const YOUTUBE_FEEDS_URL = "https://onboardingwebapp01.azurewebsites.net/qa/app/api/notification/master/getyoutubecontent";
export const TWITTER_FEEDS_URL = "https://onboardingwebapp01.azurewebsites.net/qa/app/api/notification/master/gettwittercontent";
export const FACEBOOK_FEEDS_URL = "https://onboardingwebapp01.azurewebsites.net/qa/app/api/notification/master/getfacebookcontent"


//Salary's APIs

export const SALARY_DETAILS = BASE_URL + '/services/rest/onboarding/cd/getSalaryDetails';
export const APPLY_JOB = BASE_URL + '/services/rest/onboarding/cd/update';
export const UPDATE_SALARY_OFFER_STATUS = BASE_URL + '/services/rest/onboarding/cd/update'


//Auth APIs
export const CHANGE_PASSWORD_URL = "https://onboardingwebapp01.azurewebsites.net/qa/app/api/candidate/profile/changepassword";
export const GET_AUTH_TOKEN = 'https://onboardingwebapp01.azurewebsites.net/qa/auth/token';


// files upload/ dwonload apis

export const LOA_DOCUMENT_DOWNLOAD_URL =  BASE_URL + '/iverify/DownloadFileServlet?Operation=DownloadAuthorizationLetter&newIverifyFlag=Y&CompanyCode=WT&'

export const LOA_DOCUMENT_UPLOAD_URL =  BASE_URL + '/iverify/rest/uploadService/uploadFile'


export const LOGIN_URL = 'https://onboardingwebapp01.azurewebsites.net/webapp/dev/#/login';
