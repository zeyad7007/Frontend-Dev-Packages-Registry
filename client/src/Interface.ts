
export interface Package {
    metadata: {
      Name: string;
      Version?: string;
      ID: string;
    };
    data: {
      Content?: string;
      URL?: string;
      JSProgram: string;
      debloat?:boolean;
    };
  }
  
  export interface PackageUploadI {
    
      Name: string;
      Content?: string;
      URL?: string;
      JSProgram: string;
      debloat?:boolean;
    
  }
  
  export interface PackageUpdateI {
    metadata: {
      Name: string;
      Version: string;
    };
    data: {
      Content?: string;
      URL?: string;
      JSProgram: string;
      debloat?:boolean;
    };
  }
  
  export interface StatusMessage{
    Code: number;
    Message:string;
  
  }
  
  export interface GetPackagesQuery{
    Name: string;
    Version: string;
  
  }
  
  export interface Metrics{
    BusFactor: number;
    BusFactorLatency: number;
    Correctness: number;
    CorrectnessLatency: number;
    RampUp: number;
    RampUpLatency: number;
    Responsiveness: number;
    ResponsivenessLatency: number;
    LicenseScore: number;
    LicenseScoreLatency: number;
    GoodPinningPractice: number;
    GoodPinningPracticeLatency: number;
    PullRequest: number;
    PullRequestLatency: number;
    NetScore: number;
    NetScoreLatency: number;
  }

  export interface CostI{
    [ID:string]:{
        standalonecost?: number;
        totalcost: number; 
    }
}

export interface PackageListI{
  id:string;
  name:string;
  version:string;
}