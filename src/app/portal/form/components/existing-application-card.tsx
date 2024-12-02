import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ExistingApplicationCardProps {
  onImport: () => void;
  onCancel: () => void;
  name: string;
  email: string;
}

export function ExistingApplicationCard({ onImport, onCancel, name, email }: ExistingApplicationCardProps) {
  const [isOpen, setIsOpen] = useState(true)

  const handleImport = () => {
    onImport()
    setIsOpen(false)
  }

  const handleCancel = () => {
    onCancel()
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-[425px]" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Existing Application Found</DialogTitle>
          <DialogDescription>We've found a previous application associated with your email.</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <p><strong>Applicant:</strong> {name}</p>
          <p><strong>Email:</strong> {email}</p>
        </div>
        <p className="mt-4">Would you like to import your previous application data? This will save you time by pre-filling the form with your existing information.</p>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleImport}>Import Previous Application</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

