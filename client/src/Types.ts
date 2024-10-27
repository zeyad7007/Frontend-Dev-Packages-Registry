// Types.ts

// Metadata for a package (used by both "Get Package by ID" and "Search by Regex")
export interface PackageMetadata {
    Name: string;
    Version: string;
    ID: string | number;
  }
  
  // Data associated with a package (used for "Get Package by ID")
  export interface PackageDataContent {
    Content?: string;
    JSProgram?: string;
    URL?: string;
    Debloat?:boolean;
  }
  
  // Full PackageData that includes metadata and data content
  export interface PackageData {
    metadata: PackageMetadata; // Metadata is required for "Get Package by ID"
    data: PackageDataContent;   // Data fields (e.g., Content, JSProgram, URL)
  }
  
  // Query parameters for API calls
  export interface QueryParams {
    id?: string;
    RegEx?: string;
    metadata?: PackageMetadata;
    data?: PackageData;
    //[key: string]: string | undefined; // Allows for any additional dynamic fields
  }
  
  // API Response type
  export interface APIResponse<T> {
    data: T;
  }
  
  // For Search by Regex endpoint
  export interface RegexQuery {
    RegEx: string;
  }
  
  export interface PackageRating {
    [key: string]: number;
  }
  
  export interface PackageCost {
    [key: string]: {
      standaloneCost?: number;
      totalCost: number;
    };
  }