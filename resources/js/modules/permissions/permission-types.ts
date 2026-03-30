export interface UserAllowedAttribute {
  attribute: string
  allowed_values: string[]
}

export interface UserRoleAction {
  action: string
  allowed_attributes: UserAllowedAttribute[] | null
}

export interface UserRole {
  role: string
  is_admin: boolean
  actions: UserRoleAction[]
}
