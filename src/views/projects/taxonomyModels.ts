export type taxonomy = {
  taxonomyUUID: string;
  name: string;
  description: string;
  categoryId: number;
  categoryName: string;
  parentId: number;
  parentName: string;
  buySide: boolean;
  sellSide: boolean;
  nonDeal: boolean;
  displayName: string;
};
export type dropdown = {
  categoryId: number;
  categoryName: string;
};

export enum taxonomyCategory {
  NatureofEngagement = 1,
  Products = 2,
  DealType = 3,
  DealValue = 4,
  Sector = 5,
  SubSector = 6,
  Services = 7,
  TransactionStatus = 8,
  ClientEntityType = 9,
  DomicileCountry = 10,
  EntityNameDisclosed = 11,
  WorkCountryRegion = 12,
  TargetEntityType = 13,
  ControllingTypes = 14,
  PwcLegalEntity = 15,
  BooleanLookup = 16,
  SBU = 17,
  SuccessfulTransaction = 18,
  PublicAnnouncement = 19,
  ParentDealType = 20,
  TargetListedUnListed = 21,
  Currency = 22,
  SourceOfMultiple = 23,
  CtmDealType = 24,
  SBUType = 25,
  CTMControllingTypes = 27,
  RestrictionResons = 28,
}

export enum engagement {
  Buy = 1,
  Sell = 2,
  NoDeal = 3,
}

export type advSearchItem = {
  id: string;
  name: string;
};

export const searchList: advSearchItem[] = [
  { id: '94', name: 'Engagement Type' },
  { id: '3', name: 'Nature of Transaction (Deal) / Nature of Work (Non Deal)' },
  { id: '95', name: 'Nature of Engagement / Deal' },
  { id: '14', name: 'Controlling/Non-Controlling' },
  { id: '4', name: 'Deal Value' },
  { id: '9', name: 'Client Entity Type' },
  { id: '10', name: "Client's or Client's Ultimate Parent entity's domicile country/region" },
  { id: '91', name: 'Successful Transaction only' },
  { id: '13', name: 'Target Entity Type' },
  { id: '12', name: 'Country/Region of Target' },
  { id: '15', name: 'PwC Legal Entity' },
  { id: '93', name: 'Include only publicly announced' },
];

export const ctmSearchList: advSearchItem[] = [
  // { id: '101', name: 'Type' },
  { id: '102', name: 'Control Type' },
  { id: '103', name: 'Sub Sector' },
  { id: '104', name: 'Deal Type' },
  { id: '105', name: 'SBU' }
];

export interface searchV2 {
  projectTypeId?: number;
  service?: number[];
  sector?: number[];
  subSector?: number[];
  engagementType?: number[];
  dealType?: number[];
  dealValue?: number[];
  controllingType?: number[];
  clientEntityType?: number[];
  targetEntityType?: number[];
  parentRegion?: number[];
  workRegion?: number[];
  transactionStatus?: number[];
  pwCLegalEntity?: number[];
  publicAnnouncement?: string[];
  pwCInPublicAnnouncement?: string[];
  dateFrom?: Date | null;
  dateTo?: Date | null;
  domCountrRegion?: number[];
  keyWords?: string;
  products?: number[];
  serviceOffering?: number[];
  showGrid?: boolean;
  resetGrid?: boolean;
  natureOfEngagement?: number[];
  sortText?: string;
  sortOrder?: string;
  pptHeader?: string;
  projectIds?: string[];
}

export type taxonomyMin = {
  id: number;
  name: string;
  categoryId: number;
};

export interface projectSearch {
  projectCode?: string;
  projectName?: string;
  clientName?: string;
  sbu?: string[];
  projectStatusList?: number[];
  resetGrid?: boolean;
  isNavigationFromOtherPage?: boolean;
}
export interface auditSearch {
  projectCode?: string;
  projectName?: string;
  userName?: string;
  srcTable?: string;   
  resetGrid?: boolean;
  dateFrom?: Date | null;
  dateTo?: Date | null;
}

export interface projectStatus {
  name: string;
  statusId: number;
}

export interface projectCtmDetail {
  uniqueId?: number;
  transactionDate?: string;
  targetName?: string;
  targetBusinessDescription?: string;
  targetListedUnListed?: string;
  targetListedUnListedId?: string;
  nameOfBidder?: string;
  stakeAcquired?: string;
  currency?: string;
  dealValue?: string;
  enterpriseValue?: string;
  revenue?: string;
  ebitda?: string;
  evRevenue?: string;
  evEbitda?: string;
  sourceOdMultiple?: string;
  dealType?: string;
  sourceOdMultipleId?: string;
  dealTypeId?: string;
  isRowInvalid?: boolean;
  isDuplicate?: boolean;
  reqSupportingFile?: boolean;
  duplicateProjectList?: string[];
  currencyId?: string;
  customMultile?: string;
  nameOfMultiple?: string;
  isHeaderInvalid?: boolean;
  projectCtmId?: number;
  notes?: string;
  errorNotes?: string;
  controllingTypeId?: string;
  controllingType?: string;
  disputeNo?:number;
  isResolve?:boolean;
}

export interface ctmSearchV2 {
  projectTypeId?: number;
  subSector?: number[];
  sector?: number[];
  dealType?: number[];
  sBU?: number[];
  controllingType?: number[];
  type?: number[];
  dateFrom?: Date | null;
  dateTo?: Date | null;
  keyWords?: string;
  showGrid?: boolean;
  resetGrid?: boolean;
  sortText?: string;
  sortOrder?: string;
}


export interface projectCfibDetail {
  projectId?: string;
  year?: number;
  month?: number;
  sectorId?: number;
  subSectorId?: number;
  projectStatusID?: number;
  showGrid?: boolean;
  resetGrid?: boolean;
  sortText?: string;
  sortOrder?: string;

}

export interface ctmSearchV3 {
  projIds?: string[];
  projCtmIds?: ReportAnIssueValues[];
  searchFilter?: ctmSearchV2;
}
export interface ReportAnIssue {
  projCtmIds?: string[];
  ReportIssue?: string;
  ReportType?: string;
}
export interface ReportAnIssueValues {
  projIds?: string;
  projCtmIds?: string;
  errorStatus: number;
  duplicateStatus: number;
}

export enum drpCheckAllItems {
  ServiceOffering = 1,
  Products = 2,
  Sector = 3,
  SubSector = 4,
  NatureOfTransaction = 5,
  NatureOfEngagement = 6,
  Controlling = 7,
  DealValue = 8,
  ClientEntity = 9,
  Clients = 10,
  TargetEntityType = 11,
  RegionOfTarget = 12,
  PwCLegalEntity = 13,
  SBU = 14,
  Status = 15,
  DealType = 16,
  ControlType = 17,
}
