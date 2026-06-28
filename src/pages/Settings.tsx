import React, { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { ToggleSwitch, Dropdown } from '@/components/ui/Form'
import { Button } from '@/components/ui/Button'
import { useApp } from '@/contexts/AppContext'
import { Volume2, Shield, Eye } from 'lucide-react'

export const Settings: React.FC = () => {
  const { preferences, setPreferences, setGlobalLoading } = useApp()
  
  // Local state for non-global settings
  const [soundsEnabled, setSoundsEnabled] = useState(true)
  const [emailAlerts, setEmailAlerts] = useState(false)
  const [offlineSync, setOfflineSync] = useState(true)

  const handleContrastChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPreferences((prev) => ({
      ...prev,
      highContrast: e.target.checked,
    }))
  }

  const handleTextScaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPreferences((prev) => ({
      ...prev,
      textScale: e.target.value as 'normal' | 'large',
    }))
  }

  const triggerMockSave = () => {
    setGlobalLoading(true)
    setTimeout(() => {
      setGlobalLoading(false)
    }, 800)
  }

  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="font-h1 text-brand-navy">System Settings</h1>
        <p className="text-sm text-slate-500 mt-1 max-w-xl leading-relaxed">
          Configure interface accessibility, alert rules, sound effects, and compliance audit log synchronizations.
        </p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Accessibility Card */}
        <Card variant="standard" className="p-6 space-y-5">
          <h3 className="font-h3 text-brand-navy flex items-center gap-2">
            <Eye className="h-5 w-5 text-brand-blue" />
            Accessibility & Visuals
          </h3>
          <div className="space-y-4">
            {/* Toggle switch high contrast */}
            <ToggleSwitch
              label="Enable High Contrast Mode"
              checked={preferences.highContrast}
              onChange={handleContrastChange}
            />
            <p className="text-[11px] text-slate-400 -mt-2 leading-relaxed">
              Enhance screen borders and visibility to comply with extreme daylight conditions at the ship bridge.
            </p>

            {/* Dropdown text scaling */}
            <div className="pt-2">
              <Dropdown
                label="System Text Scale"
                value={preferences.textScale}
                onChange={handleTextScaleChange}
                options={[
                  { label: 'Normal scale (14px baseline)', value: 'normal' },
                  { label: 'Large scale (16px baseline for legibility)', value: 'large' },
                ]}
              />
            </div>
          </div>
        </Card>

        {/* Audio and notification preferences */}
        <Card variant="standard" className="p-6 space-y-5">
          <h3 className="font-h3 text-brand-navy flex items-center gap-2">
            <Volume2 className="h-5 w-5 text-brand-blue" />
            Sound & Alerts
          </h3>
          <div className="space-y-4">
            <ToggleSwitch
              label="Enable Checklist Sound Effects"
              checked={soundsEnabled}
              onChange={(e) => setSoundsEnabled(e.target.checked)}
            />
            <ToggleSwitch
              label="Bridge Alert Notification Banners"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
            />
          </div>
        </Card>

        {/* Sync & Security configurations */}
        <Card variant="standard" className="p-6 space-y-5">
          <h3 className="font-h3 text-brand-navy flex items-center gap-2">
            <Shield className="h-5 w-5 text-brand-blue" />
            Sync & Safety Audit
          </h3>
          <div className="space-y-4">
            <ToggleSwitch
              label="Automatic Offline Syncing"
              checked={offlineSync}
              onChange={(e) => setOfflineSync(e.target.checked)}
            />
            <p className="text-[11px] text-slate-400 -mt-2 leading-relaxed">
              Maintains local data on the ECDIS tablet while offline at sea and automatically syncs when satellite connection is restored.
            </p>
          </div>
        </Card>

        {/* Action button */}
        <div className="pt-2 flex justify-end">
          <Button variant="primary" onClick={triggerMockSave}>
            Apply Settings
          </Button>
        </div>
      </div>
    </div>
  )
}
