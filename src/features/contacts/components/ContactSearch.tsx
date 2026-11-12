import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ContactSearchProps {
  value: string
  onChange: (value: string) => void
}

export function ContactSearch({ value, onChange }: ContactSearchProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="contact-search">Search contacts</Label>
      <Input
        id="contact-search"
        type="search"
        placeholder="Name, email or phone"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
