'use client'

import { useMemo, useRef, useState } from 'react'
import {
  ArrowUpRight,
  CloudUpload,
  Hash,
  Sparkles,
  X,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

type ShipProjectDialogProps = {
  trigger: React.ReactNode
}

const roleOptions = [
  'Frontend Developer',
  'Backend Developer',
  'Full-Stack Builder',
  'UI/UX Designer',
  'Mobile Developer',
  'AI Engineer',
  'DevOps / Infra',
]

export function ShipProjectDialog({ trigger }: ShipProjectDialogProps) {
  const [open, setOpen] = useState(false)
  const [stackInput, setStackInput] = useState('')
  const [stackTags, setStackTags] = useState<string[]>(['Next.js', 'TypeScript'])
  const [fileName, setFileName] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [lookingForTeammates, setLookingForTeammates] = useState(true)
  const [role, setRole] = useState('Frontend Developer')
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const canAddStack = useMemo(() => stackInput.trim().length > 0, [stackInput])

  const addStack = (value: string) => {
    const normalized = value.trim()
    if (!normalized) return

    setStackTags((current) => {
      if (current.some((item) => item.toLowerCase() === normalized.toLowerCase())) {
        return current
      }

      return [...current, normalized]
    })
    setStackInput('')
  }

  const removeStack = (value: string) => {
    setStackTags((current) => current.filter((item) => item !== value))
  }

  const handleFileChange = (files: FileList | null) => {
    const selected = files?.[0]
    if (!selected) return
    setFileName(selected.name)
  }

  const resetForm = () => {
    setStackInput('')
    setStackTags(['Next.js', 'TypeScript'])
    setFileName(null)
    setIsDragging(false)
    setLookingForTeammates(true)
    setRole('Frontend Developer')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        className={cn(
          'max-w-3xl border border-slate-200 bg-white p-0 text-slate-900 shadow-[0_32px_90px_rgba(15,23,42,0.24)]',
          'sm:rounded-[30px]',
        )}
      >
        <div className="relative overflow-hidden rounded-[inherit]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(236,72,153,0.08),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(124,58,237,0.10),transparent_38%)]" />

          <DialogHeader className="relative border-b border-slate-200 px-6 py-5 text-left sm:px-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <DialogTitle className="text-2xl font-black tracking-tight sm:text-3xl">
                  Ship Your Project
                </DialogTitle>
                <DialogDescription className="mt-2 max-w-xl text-sm text-slate-600">
                  Package the build, stack, and collaborator needs in one clean drop.
                </DialogDescription>
              </div>

              <div className="hidden rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700 sm:inline-flex">
                Builder launch form
              </div>
            </div>
          </DialogHeader>

          <form
            className="relative grid gap-5 px-6 py-6 sm:px-8"
            onSubmit={(event) => {
              event.preventDefault()
              setOpen(false)
              resetForm()
            }}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                  id="project-name"
                  placeholder="Nebula Notes"
                  className="h-11 rounded-xl border-slate-200 bg-slate-50/80 px-4 text-sm shadow-none focus-visible:border-violet-300 focus-visible:ring-violet-200"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="project-description">Short Description</Label>
                <Textarea
                  id="project-description"
                  placeholder="A collaborative canvas for builders to map features, share updates, and ship together."
                  className="min-h-28 rounded-xl border-slate-200 bg-slate-50/80 px-4 py-3 text-sm shadow-none focus-visible:border-violet-300 focus-visible:ring-violet-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="live-url">Live URL</Label>
                <Input
                  id="live-url"
                  placeholder="https://project.live"
                  className="h-11 rounded-xl border-slate-200 bg-slate-50/80 px-4 text-sm shadow-none focus-visible:border-violet-300 focus-visible:ring-violet-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="github-url">GitHub URL</Label>
                <Input
                  id="github-url"
                  placeholder="https://github.com/..."
                  className="h-11 rounded-xl border-slate-200 bg-slate-50/80 px-4 text-sm shadow-none focus-visible:border-violet-300 focus-visible:ring-violet-200"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="tech-stack">Tech Stack</Label>
                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3 shadow-none focus-within:border-violet-300 focus-within:ring-2 focus-within:ring-violet-100">
                  <div className="flex flex-wrap gap-2">
                    {stackTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700"
                      >
                        <Hash className="size-3.5" />
                        <span className="font-mono">&lt;&gt; {tag}</span>
                        <button
                          type="button"
                          onClick={() => removeStack(tag)}
                          className="ml-1 inline-flex size-4 items-center justify-center rounded-full text-violet-500 transition hover:bg-violet-100 hover:text-violet-700"
                        >
                          <X className="size-3" />
                        </button>
                      </span>
                    ))}

                    <input
                      id="tech-stack"
                      value={stackInput}
                      onChange={(event) => setStackInput(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ',') {
                          event.preventDefault()
                          if (canAddStack) addStack(stackInput)
                        }
                      }}
                      placeholder="Type a stack and press Enter"
                      className="min-w-[220px] flex-1 border-0 bg-transparent px-1 py-2 text-sm outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label>Upload thumbnail</Label>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  onDragEnter={(event) => {
                    event.preventDefault()
                    setIsDragging(true)
                  }}
                  onDragOver={(event) => {
                    event.preventDefault()
                    setIsDragging(true)
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(event) => {
                    event.preventDefault()
                    setIsDragging(false)
                    handleFileChange(event.dataTransfer.files)
                  }}
                  className={cn(
                    'group flex w-full flex-col items-center justify-center rounded-2xl border border-dashed px-5 py-8 text-center transition',
                    isDragging
                      ? 'border-violet-400 bg-violet-50'
                      : 'border-slate-300 bg-slate-50/70 hover:border-violet-300 hover:bg-violet-50/60',
                  )}
                >
                  <CloudUpload className="size-6 text-violet-600" />
                  <p className="mt-3 text-sm font-semibold text-slate-800">
                    Drag and drop a thumbnail here, or click to upload
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    PNG, JPG, or WebP. The banner will feel right at home on the project card.
                  </p>
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 shadow-sm">
                    <Sparkles className="size-3.5 text-fuchsia-500" />
                    {fileName ?? 'No file selected yet'}
                  </div>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => handleFileChange(event.target.files)}
                />
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-4 sm:col-span-2">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Looking for teammates?</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Turn this on if you want the post to surface open roles.
                  </p>
                </div>
                <Switch checked={lookingForTeammates} onCheckedChange={setLookingForTeammates} />
              </div>

              {lookingForTeammates && (
                <div className="space-y-2 sm:col-span-2">
                  <Label>Role needed</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger className="h-11 w-full rounded-xl border-slate-200 bg-slate-50/80 px-4 text-sm shadow-none focus:ring-violet-200">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roleOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-end">
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-full border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                onClick={() => {
                  setOpen(false)
                  resetForm()
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-11 rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 px-6 text-sm font-semibold text-white shadow-[0_18px_30px_rgba(168,85,247,0.28)] transition hover:shadow-[0_22px_40px_rgba(236,72,153,0.32)]"
              >
                Ship Project
                <ArrowUpRight className="size-4" />
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}