export interface SystemModule {
  id: number
  name: string
}

export interface ParameterDomain {
  id: number
  domain_name: string
  description?: string
  domain_code?: string
  managed_by_module?: number | string
  managed_by_module_name?: string
  system_module?: Partial<SystemModule> | null
}
export interface ParameterDefinition {
  id: number
  parameter_name: string
  domain_id: number
  is_effective_date_driven: boolean
  attribute1_name?: string
  attribute2_name?: string
  attribute3_name?: string
  attribute4_name?: string
  attribute5_name?: string
  domain?: { id: number; domain_name: string; system_module?: Partial<SystemModule> | null }
  system_module?: Partial<SystemModule> | null
}

export interface ParameterValues {
  id: number
  parameter_code: string
  parameter_value: string
  definition_id: number
  parent_id: number
  attribute1_value: string
  attribute2_value: string
  attribute3_value: string
  attribute4_value: string
  attribute5_value: string
  effective_start_date: string
  effective_end_date: string
  is_active: boolean
  sort_priority: number
  notes: string
  definition?: ParameterDefinition | null
  domain?: Partial<ParameterDomain> | null
  system_module?: Partial<SystemModule> | null
}
