import { Check } from 'lucide-react';

interface StepIndicatorProps {
  steps: { id: string; title: string }[];
  currentStep: number;
  onStepClick: (step: number) => void;
}

export function StepIndicator({ steps, currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <div className="relative">
      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700 -translate-y-1/2" />
      
      <div className="relative flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          
          return (
            <button
              key={step.id}
              onClick={() => onStepClick(index)}
              disabled={index > currentStep}
              className="flex flex-col items-center"
            >
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center 
                ${isCompleted ? 'bg-green-500' : isCurrent ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'}
                ${index > currentStep ? 'cursor-not-allowed' : 'cursor-pointer'}
                relative z-10
              `}>
                {isCompleted ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <span className={`text-sm font-medium ${isCurrent ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                    {index + 1}
                  </span>
                )}
              </div>
              <span className={`
                mt-2 text-sm font-medium
                ${isCurrent ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'}
              `}>
                {step.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
