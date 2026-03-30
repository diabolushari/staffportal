export interface Party {
  version_id: number
  party_id: number
  // Editable fields
  party_code: number
  party_legacy_code: string
  name: string
  party_type_id: number
  status_id: number
  effective_start: string | null
  effective_end: string | null
  is_current: boolean
  // Contact information
  mobile_number?: number | string | null
  telephone_number?: number | string | null
  email_address?: string | null
  address?: string | null
  fax_number?: number | string | null
  party_type?: {
    id: number
    parameter_value: string
  }
}
