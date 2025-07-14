export interface RoleDto {
  id: number;
  roleName: string;     
  description: string;
  status?: boolean;     
}

export interface CreateRoleDto {
  id: number;    
  roleName: string;       
  description: string;
  status?: boolean;
}

export interface UpdateRoleDto {
  id: number;            
  roleName: string;
  description: string;
  status?: boolean;
}

