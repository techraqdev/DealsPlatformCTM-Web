export type ProjectListItemType = {
  projectId: number;
  projectCode: string;
  taskCode: string;
};

export type ProjectContextState = {
  projects: ProjectListItemType[];
};

export interface IProjectSearchFilter {
  projectCode: string;
  taskCode: string;
  clientName: string;
  clientEmail: string;
  projectPartner: string;
  taskManager: string;
  hoursBooked: number;
  dateOfUpload?: any;
  billingAmount: number;
  projectStatus: number;
  projectTypeId: number;
  status: number;
}
export interface IUseCaseModel {
  id: number;
  label: string;
  type: number;
}

export interface ISelectProps {
  data: IUseCaseModel[];
  selectedValues: string[];
}

export type IAddProject = {
  projectId?: any;
  projectCode: string;
  name: string;
  taskCode: string;
  clientName: string;
  hoursBooked?: string;
  projectPartner: string;
  billingAmount?: string;
  clienteMail: string;
  taskManager: string;
  projectTypeId?: number;
  sbuId?: number;
  legalEntityId?: number;
  clientContactName?:string;
  startDate?: Date | null;
  debtor?: string;
  restrictedReason?: string;
};

export type IProjectWfDTO =
  {
    projectId?: any;
    ProjectWfStatustypeId?: number;
    ProjectWfActionId?: number;
    RestrictedReason?: any;

  }

export interface IInputProps {
  showSubmitforPartnerAproval: boolean;
  showPartnerMarkasApproved: boolean;
  showClientMarkasApproved: boolean;
  showPartnerMarkasRejected: boolean;
  showClientMarkasRejected: boolean;
  showMarkasneedMoreInfo: boolean;
  projectCode: string;
  taskCode: string;
  clientName: string;
  showRemoveApproval: boolean;
}
export interface IViewProps {
  showMarkasQuotable: boolean;
  showMarkasNonQuotable: boolean;
  showMarkasRestricted: boolean;
  showOverridesRestriction: boolean;
  showConfirmRestriction: boolean;
  showRemoveRestriction: boolean;
  showRestrictionReason: boolean;
}

export interface IWfActions {
  projectWfActionId:number,
  projectStatusId:number
}
export interface IAddCfibProject {
  month: any,
  year: any,
  sector: any,
  subSector: any,
  uniqueIdentifier:any,
}
