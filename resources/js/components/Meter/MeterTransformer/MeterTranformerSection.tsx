import StrongText from '@/typography/StrongText'

export default function MeterTransformerSection({ ctpt }: { ctpt: any }) {
  return (
    <div className='grid grid-cols-2 gap-4'>
      <div>
        <StrongText>Serial No:</StrongText>
        <p>{ctpt.ctpt_serial}</p>
      </div>
      <div>
        <StrongText>Make:</StrongText>
        <p>{ctpt.make?.parameter_value}</p>
      </div>
      <div>
        <StrongText>Type:</StrongText>
        <p>{ctpt.type?.parameter_value}</p>
      </div>
      <div>
        <StrongText>Accuracy Class:</StrongText>
        <p>{ctpt.accuracy_class?.parameter_value}</p>
      </div>
      <div>
        <StrongText>Ownership:</StrongText>
        <p>{ctpt.ownership_type?.parameter_value}</p>
      </div>
      <div>
        <StrongText>Burden:</StrongText>
        <p>{ctpt.burden?.parameter_value}</p>
      </div>
      <div>
        <StrongText>Ratio:</StrongText>
        <p>
          {ctpt.ratio_primary_value} / {ctpt.ratio_secondary_value}
        </p>
      </div>
      <div>
        <StrongText>Manufacture Date:</StrongText>
        <p>{ctpt.manufacture_date}</p>
      </div>
      <div>
        <StrongText>Created At:</StrongText>
        <p>{ctpt.created_ts}</p>
      </div>
      {ctpt.updated_ts && (
        <div>
          <StrongText>Updated At:</StrongText>
          <p>{ctpt.updated_ts}</p>
        </div>
      )}
    </div>
  )
}
