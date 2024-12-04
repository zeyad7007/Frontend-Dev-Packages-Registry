
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
    isAdmin: boolean; 
  };
  Secret: {
    password: string; 
  };
}

  export interface MessageI{
    message: string;
}

export interface TokenI{
  token: string;
}

export interface PermissionsI{
  can_download: boolean;
  can_upload: boolean;
  can_search: boolean;
};

export interface UserPermissionsResponseI {
  message: string; 
  user: {
    id: number; 
    can_download: boolean; 
    can_search: boolean; 
    can_upload: boolean;
  };
};

export interface UserRegisterI{
  name: string;
  password: string;
  isAdmin: boolean;
  groupId: number;
  canDownload: boolean;
  canSearch: boolean;
  canUpload: boolean;
};

export interface GroupI{
  name: string;
};

export interface UsertoGroupI{
  user_id: number;
};

export interface PackettoGroupI{
  package_id: number;
};

export interface GroupResponseI{
  id: number;
  group_name: string;
};

export interface UserinGroupI{
  id: number;
  name: string;
};

export interface PackageHistoryI {
  id: number; 
  package_id: number; 
  user_id: number;
  action: string; 
  action_date: string; 
};

export interface PackageHistoryBodyI {
  id: number;
};