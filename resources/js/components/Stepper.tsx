'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import NormalText from '@/typography/NormalText'
import { useState } from 'react'

interface Step {
  id: number
  title: string
  status?: 'default' | 'error' | 'completed'
  cardTitle?: string
  cardSubtitle?: string
}

interface StepperProps {
  steps: Step[]
  activeStep?: number
  onStepChange?: (stepIndex: number) => void
  children?: React.ReactNode
}

export default function Stepper({
  steps,
  activeStep: activeStepProp,
  onStepChange,
  children,
}: Readonly<StepperProps>) {
  const [activeStep, setActiveStep] = useState(activeStepProp || 0)
  const currentStep = activeStepProp ?? activeStep

  const goToStep = (index: number) => {
    if (onStepChange) onStepChange(index)
    else setActiveStep(index)
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) goToStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 0) goToStep(currentStep - 1)
  }

  return (
    <div className='w-full'>
      {/* Step headers */}
      <div className='mb-8 flex justify-between'>
        {steps.map((s, index) => (
          <button
            key={s.id}
            type='button'
            onClick={() => goToStep(index)}
            className={cn(
              'flex-1 border-b-2 py-2 text-center transition-colors',
              s.status === 'error'
                ? 'border-red-500 text-red-500'
                : currentStep === index
                  ? 'border-blue-600 font-semibold text-blue-600'
                  : currentStep > index
                    ? 'border-green-500 text-green-500'
                    : 'border-gray-300 text-gray-400'
            )}
          >
            {s.title}
          </button>
        ))}
      </div>

      {/* Step content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep].cardTitle}</CardTitle>
          <NormalText>{steps[currentStep].cardSubtitle}</NormalText>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  )
}
