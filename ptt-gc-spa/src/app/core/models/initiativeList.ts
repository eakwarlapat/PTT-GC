export interface InitiativeList {
  id: number;
  initiativeCode: string;
  name: string;
  ownerName: string;
  organization: string;
  registeringDate: Date;
  cim: number;
  pim: number;
  dim: number;
  max: number;
  directCapex: number;
  cpi: number;
  strategy: number;
  randD: number;
  other: number;
  initiativeType: string;
  status: string;
  stage: string;
  createdBy: string;
  createdDate: Date;
}
