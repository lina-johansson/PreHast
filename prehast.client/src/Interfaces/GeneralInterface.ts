import { TablePaginationConfig } from "antd";
import { LocaleComponentName } from "antd/es/locale/useLocale";
import { FilterValue } from "antd/es/table/interface";
 
import dayjs from 'dayjs';
import { boolean } from "yup";
 

export const dateFormat = 'YYYY/MM/DD';
 
export interface ListVardPersonal {

    id: string;
    name: string;
    personNo: number;
    omfatningId: number;
    omfatningName: string;
    email: string;
    departmentId: number;
    departmentName: string;
    phoneNumber: string;
    personPosition: string;
    lastLogin: string;
    created_date: string;
    created_by: string;
    updated_date: string;
    updated_by: string;
    lockoutEnabled: boolean;
    lockoutEnabledDate: string;
    roles: Role[]
}

export interface CrudVardPersonal {

    id: string;
    name: string;
    personNo: number;
    omfatningId: number;
    email: string;
    departmentId: number;
    phoneNumber: string;
    personPosition: string;
    departmentName: string;
    roles: Role[]
}

 

export interface Role {
    roleId: string;
    roleName: string;
    roleNameSW : string;
    isSelected: boolean;
}


export interface IRules {
    allowedRules: string[];
}

export interface LoginDto {
    id: string;
    email: string;
    password: string;
    rememberMe: boolean;
}
export interface resetPass {
    id: string;
    token: string,
    newPassword: string;
    confirmPassword: string;
}
 
export interface ILoginResponse {
    token: string;
    expiration: Date,
    refresh_token: string,
    refresh_token_expiry: Date,
    message: string,
    loginStatus: boolean,
    passwordChange: boolean,
    userRoles: string[];
    basicUserInfo: IbasicUserInfo
}
export interface IbasicUserInfo {
    userName: string;
    deparmentName    : string;
    omfatningName    : string;
   

}
export interface IAuth {
    loginResponse: ILoginResponse;
    loading: boolean;
    messegeError: string

}
export interface TableParams {
    pagination?: TablePaginationConfig;
    sortField?: string;
    sortOrder?: string;
    filters?: Record<string, FilterValue>;
}
export interface ModalState {
    isOpen: boolean,
    postState: boolean,
    Width: number,
    title: string,
    content: LocaleComponentName,
    modalIcon: LocaleComponentName,
    loading: boolean,
    height: number;
}

export interface AutoCompleteKV {
    value: number;
    label: string;
}


export interface KeyValue {
    key: number;
    value: string;
}

export interface NewsDto {
    id1: number;
    id: number;
    applicationUserId: string;
    details: string;
    can: boolean;
    canAll: boolean;
}

  
 
export interface HowDto {
    rankName :string,
    userName: string,
    unitName: string,
}

export interface PatientDto {
    id: number,
    name: string,
    personNummer: number,
}

export interface PatientCrudDto {
    id: number,
    name: string,
    personNummer: number,
}
// 6-12-2024
export interface FragorDto {
    id: number;
    name: string;
    description: string;
    sort: number;
    hasLeftRight: boolean;
    svarsDto: SvarDto[];    
}
export interface SvarDto {
    id: number;
    name: string;
    description: string;
    sort: number;
    degree: number;
    fragorId: number;
   
}
export interface FragorCrudDto {
    id: number;
    name: string;
    description: string;
    sort: number;
    hasLeftRight: boolean;
    svarsCrudDto: SvarCrudDto[];
}
export interface SvarCrudDto {
    id: number;
    name: string;
    description: string;
    sort: number;
    degree: number;
    fragorId: number;
  
}

export interface IPatientKotroll  {
 
    patientData: PatientDto,
    patientTests:IPatientTest[]
}
export interface IPatientTest {
    id: number; //Final Kontroll Id
    patientId: number; //Final Kontroll Id
    vardData: VardData,
    testDate: string,
    notc: string,
    testDegree:number
}

export interface PatientKotrollCreate {
    id: number;
    patientData: PatientDto;
    vardData: VardData; 
    fragors: FragorToCreate[];  
    sumSvar: number;
    sent: boolean;
    notc: string;
    date: string;
    vardToSent: string;
    }
export interface VardData {
    vardId: string;
    vardOmfatning: string;
    vardName: string;
   
}
export interface FragorToCreate {
    id: number;
    name: string; 
    description: string; 
    sort: number;
    hasLeftRight: boolean;
    svars: SvarDto[];
    svarAnswerLeft: number;
    svarAnswerRight: number;
    manyAnswers:ManyAnswers[]

}
export interface ManyAnswers {
    svarAnswerLeft: number;
    svarAnswerRight: number;
}
export interface ResponseStatus {
   message: string;
   success: boolean;
   statusCode: number;
}
export interface KontrollVard {
    vardId: string;
    rsid: string;
    vardOmfiting: string;
    vardName: string;
    vardIsActive: boolean;
}

export interface DectorTest {
    KontrollVard: KontrollVard;
    patientsTests: IPatientTest[]
}