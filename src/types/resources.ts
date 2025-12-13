export enum ResourceType {
  VIDEO = 'video',
  DISCORD = 'discord',
  AUDIO = 'audio',
  INSTAGRAM = 'instagram',
}

export interface Resource {
  id: string;
  type: ResourceType;
  title: string;
  description?: string;
  url: string;
  is_active: boolean;
  cover?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateResourceDto {
  type: ResourceType;
  title: string;
  description?: string;
  url: string;
  is_active?: boolean;
  cover?: string;
}

export interface UpdateResourceDto {
  type?: ResourceType;
  title?: string;
  description?: string;
  url?: string;
  is_active?: boolean;
  cover?: string;
}

export interface ResourceResponse {
  data: Resource;
  message: string;
}

export interface ResourcesResponse {
  data: Resource[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
}
