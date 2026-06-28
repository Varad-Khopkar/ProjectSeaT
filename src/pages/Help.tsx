import React, { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Accordion } from '@/components/ui/Data'
import { TextInput, Textarea } from '@/components/ui/Form'
import { Button } from '@/components/ui/Button'
import { Mail, BookOpen } from 'lucide-react'
import { useApp } from '@/contexts/AppContext'

export const Help: React.FC = () => {
  const { setGlobalLoading } = useApp()
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [successMsg, setSuccessMsg] = useState(false)

  const faqItems = [
    {
      title: 'How do I start a Port State Control (PSC) mock audit?',
      content: 'Navigate to the "Training Modules" page from the navigation bar, locate the "Port State Control (PSC) Inspection" card, and click "Start Training". Follow the on-screen prompts to inspect compartments, logbooks, and machinery rooms.',
    },
    {
      title: 'What does a Vessel Detention protocol represent?',
      content: 'During an audit, if a major safety deficiency is identified (such as an empty lifejacket locker or an oil separator leak) and not resolved in time, the Port State inspector may issue a Vessel Detention. In the training environment, this triggers a detention modal and locks mission completion.',
    },
    {
      title: 'How is the Crew Score calculated on the Leaderboard?',
      content: 'Your score increases as you verify correct safety parameters during simulated checks. Completing items correctly on the first attempt awards bonus multipliers. Unresolved deficiencies or incorrect audits decrease your total points.',
    },
    {
      title: 'Is my check progress saved if the ship connection is lost?',
      content: 'Yes! The platform automatically backs up your active checklist data to the local browser storage on your tablet. When satellite connection recovers, the logs sync automatically to the ship registry server.',
    },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setGlobalLoading(true)
    setTimeout(() => {
      setGlobalLoading(false)
      setSubject('')
      setMessage('')
      setSuccessMsg(true)
      setTimeout(() => setSuccessMsg(false), 3000)
    }, 900)
  }

  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="font-h1 text-brand-navy">Support & Help Center</h1>
        <p className="text-sm text-slate-500 mt-1 max-w-xl leading-relaxed">
          Access FAQ guidelines on vessel audits, SOLAS protocols, scoring systems, and contact maritime helpdesk operators.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Accordion FAQ Area */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-h3 text-brand-navy flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-brand-blue" />
            Frequently Asked Questions
          </h3>
          <Accordion items={faqItems} />
        </div>

        {/* Support ticket submission form */}
        <div className="space-y-4">
          <h3 className="font-h3 text-brand-navy flex items-center gap-2">
            <Mail className="h-5 w-5 text-brand-blue" />
            Contact Support
          </h3>
          <Card variant="standard" className="p-5">
            <form onSubmit={handleSubmit} className="space-y-4">
              <TextInput
                label="Message Subject"
                placeholder="e.g., Syncing error on ECDIS tablet"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
              <Textarea
                label="Detailed Description"
                placeholder="Include error codes or the active module code..."
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              
              {successMsg && (
                <div className="text-xs text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 p-2.5 rounded-[8px] uppercase text-center font-mono">
                  Ticket Submitted Successfully
                </div>
              )}

              <Button type="submit" variant="primary" className="w-full justify-center">
                Submit Support Ticket
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
