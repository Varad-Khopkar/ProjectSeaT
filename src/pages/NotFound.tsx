import React from 'react'
import { EmptyState } from '@/components/ui/Data'
import { Button } from '@/components/ui/Button'
import { Link } from 'react-router-dom'
import { Anchor } from 'lucide-react'

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="max-w-md w-full">
        <EmptyState
          title="Vessel Lost Off Course (404)"
          description="The navigation route you are looking for does not exist in our sea charts. Please reset your coordinates to return to the harbor dashboard."
          action={
            <Link to="/">
              <Button variant="primary" leftIcon={<Anchor className="h-4 w-4" />}>
                Return to Dashboard
              </Button>
            </Link>
          }
        />
      </div>
    </div>
  )
}
