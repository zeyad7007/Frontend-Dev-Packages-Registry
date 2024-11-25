
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
    RampUp: number;
    Correctness: number;
    BusFactor: number;
    ResponsiveMaintainer: number;
    LicenseScore: number;
    GoodPinningPractice: number;
    PullRequest: number;
    NetScore: number;
    RampUpLatency: number;
    CorrectnessLatency: number;
    BusFactorLatency: number;
    ResponsiveneMaintainerLatency: number;
    LicenseScoreLatency: number;
    GoodPinningPracticeLatency: number;
    PullRequestLatency: number;
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

export interface AuthenticateI{
  User: {
    name: string; 
    isAdmin: false; 
  };
  Secret: {
    password: string; 
  };
}

  export interface LogoutI{
    message: string;
}

export interface TokenI{
  token: string;
}