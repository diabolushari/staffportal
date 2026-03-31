import { Meter } from './data_interfaces'

export interface MeterWithMf {
  meter: Meter
  meter_mf: number
}

export interface BillMeterReading {
  timezone: string | null
  timezone_code: string | null
  initial_reading: number
  final_reading: number
  difference: number
  meter_mf: number | null
  value: number
  parameter_id: string | null
  parameter_name: string | null
  parameter_display: string | null
}

export interface ChargeHeadItem {
  id: string
  name: string
  result: string
  zone_id: number | null
}

export interface ComputedZoneResult {
  result: string
  zoneId: number | null
}

export interface ComputedProperty {
  id: string
  name: string
  result: string | ComputedZoneResult[]
  zoneId?: number | null
}
export interface ComputedProperties {
  recorded_max_demand: ComputedProperty
  total_consumption: ComputedProperty
  kva_rate: ComputedProperty
  kwh_rate: ComputedProperty
  _75_of_contract_demand: ComputedProperty
  excess_demand: ComputedProperty
  energy_charge: ComputedProperty
  electricity_duty: ComputedProperty
  lag: ComputedProperty
  lead: ComputedProperty
  demand_charge: ComputedProperty
  excess_demand_charge: ComputedProperty
  power_factor: ComputedProperty
  zone_with_max_demand_value: ComputedProperty
  _130_of_contract_demand: ComputedProperty
  total_consumption_factory_lighting: ComputedProperty
  total_consumption_colony_lighting: ComputedProperty
  total_consumption_generator: ComputedProperty
  excess_demand_rate: ComputedProperty
  energy_charge_rates: ComputedProperty
  electricity_surcharge_rate: ComputedProperty
  self_generation_duty_rate: ComputedProperty
  electricity_duty_rate: ComputedProperty
  colony_lighting_unit_rate: ComputedProperty
  factory_lighting_unit_rate: ComputedProperty
  time_zones: ComputedProperty
  tariff: ComputedProperty
  monthly_fuel_surcharge_rate: ComputedProperty
  green_energy_charge_rate: ComputedProperty
  lt_surcharge: ComputedProperty
}

export interface OtherChargeItem {
  id: string
  name: string
  rate: number
  units: number
  amount: number
  zoneId: number | null
}

export interface TotalDemandChargeRow {
  label: string
  units: number
  rate: number
  amount: number
}

export interface TotalEnergyChargeRow {
  label: string
  units: number
  rate: {
    result: number
    zoneId: number | null
  }
  amount: number
}
export interface TotalEnergyCharge {
  title: string
  rows: TotalEnergyChargeRow[]
}

export interface TotalDemandCharge {
  title: string
  rows: TotalDemandChargeRow[]
}

export interface ChargeHeads {
  energy_charge: ChargeHeadItem
  electricity_duty: ChargeHeadItem
  electricity_surcharge: ChargeHeadItem
  monthly_fuel_surcharge: ChargeHeadItem
  power_factor_incentive_and_disincentive: ChargeHeadItem
  total_demand_charge: ChargeHeadItem
  green_energy_charge: ChargeHeadItem
  self_generation_duty: ChargeHeadItem
  colony_lighting: ChargeHeadItem
  factory_lighting: ChargeHeadItem
  lt_surcharge: ChargeHeadItem
}
