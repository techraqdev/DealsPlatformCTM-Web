export enum MessageType {
  Success = 1,
  Error = 2,
  Warning = 3,
}
export enum Project_Wf_Actions {
  CreateProject = 1,
  EmailTriggered = 2,
  MarkasQuotable = 3,
  MarkasNonQuotable = 4,
  MarkasRestricted = 5,
  OverridesRestriction = 6,
  SubmitforPartnerAproval = 7,
  MarkasRejectedPartner = 8,
  MarkasApprovedPartner = 9,
  MarkasApprovedClient = 10,
  MarkasRejectedClient = 11,
  MarkasneedMoreInfo = 12,
  ConfirmRestriction = 13,
  RemoveRestriction = 14,
  RemoveApproval = 15
}

export enum Project_Wf_StatusTypes {
  Created = 1,
  NotResponded = 2,
  Quotable = 3,
  NotQuotable = 4,
  Restricted = 5,
  PartnerApprovalPending = 6,
  RejectedbyPartner = 7,
  ClientApprovalPending = 8,
  RejectedbyClient = 9,
  ClientSeekingMoreInfo = 10,
  Approved = 11,
  RestrictionConfirmed = 12
}

export enum Ctm_Project_Wf_StatusTypes {
  Created = 201,
  NotResponded = 202,
  CanbeUsedforCTM = 203,
  CannotbeUsedforCTM = 204,
  EngagementOngoing = 205,
  EngagementCompleted = 206,
  CannotbeusedConfirmed = 207,
  InofrmationUploaded = 208
}

export enum Ctm_Project_Wf_Actions {
  CreateProject = 201,
  EmailTriggered = 202,
  MarkAsCanBeUsed = 203,
  MarkAsCannotBeUsed = 204,
  MarkAsEngagementOngoing = 205,
  MarkAsEngagementCompleted = 206,
  ConfirmCannotBeUsed = 207,
  UploadInformation = 208,
  RejectCannotbeUsed = 209
}

export const STATUS_TYPES: any = {
  Active: 1,
  InActive: 2,
  Deleted: 3,
};

export enum MasterScreenTypes {
  MasterCategory = 1,
  Category = 2,
  SubCategory = 3,
  Brands = 4,
  Features = 5,
  ProductionTeam = 6,
}

export enum UserTypesEnum {
  Admin = 1,

}

export enum Cfib_Project_Wf_StatusTypes {
  ProjectCreated = 305,
  InofrmationUploaded = 301,
  MarkedAsInformationNotAvailable = 302,
  InformationNotAvailableConfirmed = 303,
  InformationNotAvailableRejected = 304,
}
export enum Cfib_Project_Wf_Actions {
  ProjectCreated = 305,
  InofrmationUploaded = 301,
  MarkedAsInformationNotAvailable = 302,
  InformationNotAvailableConfirmed = 303,
  InformationNotAvailableRejected = 304,
  ViewProjectData = 306,
}
export enum Report_Types {
  CTMDuplicateData= 2101,
  CTMErrorData = 2201,
  CTMDuplicateResolved = 2102,
  CTMDuplicateNotanIssue = 2103,
  CTMErrorResolved = 2202,
  CTMErrorNotanIssue = 2203,
}
