import { TariffConfig, TariffOrder } from '@/interfaces/data_interfaces'
import { Paginator } from '@/ui/ui_interfaces'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Pagination from '@/ui/Pagination/Pagination'
import CustomCard from '@/ui/Card/CustomCard'
import { useState } from 'react'
import DeleteModal from '@/ui/Modal/DeleteModal'
import TariffConfigForm from '../TariffConfigForm'
import { ParameterValues } from '@/interfaces/parameter_types'
import { getDisplayDate } from '@/utils'
import ActionButton from '@/components/action-button'
import TariffConfigInlineSearch from './TariffConfigInlineSearch'

interface Props {
  tariff_configs: Paginator<TariffConfig>
  tariffOrder: TariffOrder
  connectionTariffs: ParameterValues[]
  oldConnectionTariffId: number
}

export default function TariffConfigTable({
  tariff_configs,
  tariffOrder,
  connectionTariffs,
  oldConnectionTariffId,
}: Props) {
  const [addTariffConfig, setAddTariffConfig] = useState<boolean>(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedTariffConfig, setSelectedTariffConfig] = useState<TariffConfig | null | undefined>(
    null
  )

  const handleDelete = (tariffConfig: TariffConfig) => {
    setSelectedTariffConfig(tariffConfig)
    setIsDeleteModalOpen(true)
  }
  const handleEdit = (tariffConfig: TariffConfig) => {
    setSelectedTariffConfig(tariffConfig)
    setAddTariffConfig(true)
  }
  console.log(tariff_configs)

  return (
    <CustomCard
      title='Tariff Configurations'
      onAddClick={() => {
        setSelectedTariffConfig(null)
        setAddTariffConfig(true)
      }}
      addButtonText='Add Tariff Config'
      searchSlot={
        <div className='w-full items-center'>
          <TariffConfigInlineSearch
            tariffOrder={tariffOrder}
            connectionTariffs={connectionTariffs}
            oldConnectionTariffId={oldConnectionTariffId}
          />
        </div>
      }
    >
      <div className='overflow-visible'></div>
      <div className='overflow-visible'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[50px]'>#</TableHead>
              <TableHead>Connection Tariff</TableHead>
              <TableHead>Lower Limit</TableHead>
              <TableHead>Upper Limit</TableHead>
              <TableHead>Demand Charge</TableHead>
              <TableHead>Energy Charge</TableHead>
              <TableHead>Effective Start</TableHead>
              <TableHead>Effective End</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tariff_configs?.data?.map((config, index) => (
              <TableRow key={config.tariff_config_id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{config.connection_tariff?.parameter_value || '-'}</TableCell>
                <TableCell>{config.consumption_lower_limit ?? '-'}</TableCell>
                <TableCell>{config.consumption_upper_limit ?? '-'}</TableCell>
                <TableCell>{config.demand_charge_kva ?? '-'}</TableCell>
                <TableCell>{config.energy_charge_kwh ?? '-'}</TableCell>
                <TableCell>{getDisplayDate(config.effective_start)}</TableCell>
                <TableCell>{getDisplayDate(config.effective_end)}</TableCell>

                <TableCell className='relative'>
                  <div>
                    <ActionButton
                      onEdit={() => handleEdit(config)}
                      onDelete={() => handleDelete(config)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {isDeleteModalOpen && selectedTariffConfig && (
              <DeleteModal
                title='Delete Tariff Config'
                url={route('tariff-configs.destroy', selectedTariffConfig.tariff_config_id)}
                setShowModal={() => setIsDeleteModalOpen(false)}
              >
                Are you sure to delete {selectedTariffConfig.connection_tariff?.parameter_value}
              </DeleteModal>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className='mt-4'>
        <Pagination pagination={tariff_configs} />
      </div>
      {addTariffConfig && (
        <TariffConfigForm
          tariffOrder={tariffOrder}
          connectionTariffs={connectionTariffs ?? []}
          setModalOpen={setAddTariffConfig}
          tariffConfig={selectedTariffConfig}
        />
      )}
    </CustomCard>
  )
}
