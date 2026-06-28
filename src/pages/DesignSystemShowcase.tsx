import React, { useState } from 'react'
import { Eye, ShieldAlert, Award, BookOpen, Anchor, CheckCircle } from 'lucide-react'

// Common Components Imports
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import {
  TextInput,
  SearchField,
  PasswordInput,
  Textarea,
  Dropdown,
  Checkbox,
  RadioButton,
  ToggleSwitch,
} from '@/components/ui/Form'
import { Navbar, Sidebar, Breadcrumb, Tabs } from '@/components/navigation/Navigation'
import { Alert, Badge, StatusChip, Toast, Tooltip, Modal, ProgressBar } from '@/components/ui/Feedback'
import { Table, Timeline, Accordion, EmptyState, Pagination, SkeletonLoader } from '@/components/ui/Data'
import { SectionContainer } from '@/components/layout/SectionContainer'

export const DesignSystemShowcase: React.FC = () => {
  // Navigation Sidebar States
  const [activeCategory, setActiveCategory] = useState('tokens')

  // Form Field States
  const [toggleVal, setToggleVal] = useState(false)
  const [checkboxVal, setCheckboxVal] = useState(false)
  const [radioVal, setRadioVal] = useState('option-1')
  const [dropdownVal, setDropdownVal] = useState('deck')

  // Feedback States
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isToastOpen, setIsToastOpen] = useState(false)

  // Interactive Tab State
  const [activeTab, setActiveTab] = useState('info')

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)

  const sidebarTabs = [
    { id: 'tokens', label: 'Visual Foundations', icon: Award },
    { id: 'buttons-cards', label: 'Buttons & Cards', icon: BookOpen },
    { id: 'forms', label: 'Form Controls', icon: Eye },
    { id: 'navigation', label: 'Navigation Elements', icon: Anchor },
    { id: 'feedback', label: 'Feedback & Modals', icon: ShieldAlert },
    { id: 'data', label: 'Data & Timelines', icon: CheckCircle },
  ]

  // Mock Data definitions
  const tableHeaders = ['Inspection Item', 'Vessel Location', 'Responsible Officer', 'Status']
  const tableRows = [
    ['Lifeboat Release Gear', 'Aft Deck', 'Chief Officer', <StatusChip status="passed" label="Passed" />],
    ['Emergency Fire Pump', 'Steering Flat', 'Second Engineer', <StatusChip status="passed" label="Passed" />],
    ['Oil Record Book Part I', 'Ship Office', 'Chief Engineer', <StatusChip status="warning" label="Warning" />],
    ['EEBD Pressure Test', 'Engine Room', 'Safety Officer', <StatusChip status="failed" label="Deficiency" />],
    ['Navigational Charts update', 'Bridge', 'Second Officer', <StatusChip status="pending" label="Pending" />],
  ]

  const timelineSteps = [
    {
      title: 'PSC Inspector Boards Vessel',
      desc: 'Inspector checks certificates and ship safety logs at the ship office.',
      date: '08:30 LT',
      status: 'completed' as const,
    },
    {
      title: 'Bridge Documentation Review',
      desc: 'Verify chart corrections, GMDSS logs, and ECDIS backup status.',
      date: '09:15 LT',
      status: 'completed' as const,
    },
    {
      title: 'Deck Equipment Inspection',
      desc: 'Drill testing on fire hoses, lifeboat launching gears, and survival crafts.',
      date: '10:30 LT',
      status: 'active' as const,
    },
    {
      title: 'Engine Room Tour & Bilge Check',
      desc: 'Inspecting quick-closing valves, clean bilges, and oily water separator log files.',
      date: '13:00 LT',
      status: 'upcoming' as const,
    },
  ]

  const accordionItems = [
    {
      title: 'What is a Port State Control (PSC) Inspection?',
      content:
        'A Port State Control inspection is the inspection of foreign ships in national ports to verify that the condition of the ship and its equipment comply with the requirements of international regulations and that the ship is manned and operated in compliance with these rules.',
    },
    {
      title: 'Common detainable deficiencies in PSC Inspections',
      content:
        'Detainable deficiencies frequently include: malfunction of emergency generator/fire pumps, corroded structural boundaries, non-functional oily water separators, lack of chart updates, and crew members failing to execute basic safety drills.',
    },
  ]

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeCategory} onTabChange={setActiveCategory} tabs={sidebarTabs} />

      {/* Main Content Area */}
      <div className="flex-1 w-full space-y-6">
        
        {/* Category: Visual Foundations */}
        {activeCategory === 'tokens' && (
          <SectionContainer title="Visual Foundations" subtitle="Design tokens, Color Themes, and Typography scales.">
            {/* Color Palette Grid */}
            <div className="mb-8">
              <h3 className="font-h3 text-brand-navy mb-4 font-mono text-xs uppercase tracking-wider">Color Palette (Harbor Sunset)</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="flex flex-col rounded-[16px] overflow-hidden border border-slate-200 shadow-small">
                  <div className="bg-brand-navy h-20 w-full" />
                  <div className="p-3 bg-white text-left">
                    <span className="font-semibold text-xs text-brand-navy block">Harbor Navy</span>
                    <span className="font-mono text-[10px] text-slate-400">#12355B</span>
                    <span className="text-[10px] bg-slate-100 text-slate-500 rounded px-1 mt-1 inline-block">Primary</span>
                  </div>
                </div>

                <div className="flex flex-col rounded-[16px] overflow-hidden border border-slate-200 shadow-small">
                  <div className="bg-brand-blue h-20 w-full" />
                  <div className="p-3 bg-white text-left">
                    <span className="font-semibold text-xs text-brand-navy block">Ocean Blue</span>
                    <span className="font-mono text-[10px] text-slate-400">#2F6690</span>
                    <span className="text-[10px] bg-slate-100 text-slate-500 rounded px-1 mt-1 inline-block">Interactive</span>
                  </div>
                </div>

                <div className="flex flex-col rounded-[16px] overflow-hidden border border-slate-200 shadow-small">
                  <div className="bg-brand-gold h-20 w-full" />
                  <div className="p-3 bg-white text-left">
                    <span className="font-semibold text-xs text-brand-navy block">Sunset Gold</span>
                    <span className="font-mono text-[10px] text-slate-400">#F4A261</span>
                    <span className="text-[10px] bg-slate-100 text-slate-500 rounded px-1 mt-1 inline-block">CTA / Progress</span>
                  </div>
                </div>

                <div className="flex flex-col rounded-[16px] overflow-hidden border border-slate-200 shadow-small">
                  <div className="bg-brand-coral h-20 w-full" />
                  <div className="p-3 bg-white text-left">
                    <span className="font-semibold text-xs text-brand-navy block">Coral Red</span>
                    <span className="font-mono text-[10px] text-slate-400">#E76F51</span>
                    <span className="text-[10px] bg-slate-100 text-slate-500 rounded px-1 mt-1 inline-block">Highlight / Alert</span>
                  </div>
                </div>

                <div className="flex flex-col rounded-[16px] overflow-hidden border border-slate-200 shadow-small">
                  <div className="bg-brand-pearl h-20 w-full border-b border-slate-200" />
                  <div className="p-3 bg-white text-left">
                    <span className="font-semibold text-xs text-brand-navy block">Pearl White</span>
                    <span className="font-mono text-[10px] text-slate-400">#FAF7F2</span>
                    <span className="text-[10px] bg-slate-100 text-slate-500 rounded px-1 mt-1 inline-block">App Bg</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Typography Scale */}
            <div className="mb-8">
              <h3 className="font-h3 text-brand-navy mb-4 font-mono text-xs uppercase tracking-wider">Typography scale</h3>
              <div className="space-y-4 border border-slate-200/80 rounded-[12px] p-6 bg-white shadow-small text-left">
                <div>
                  <span className="font-mono text-[9px] text-slate-400 font-bold block mb-1">FONT-DISPLAY</span>
                  <h1 className="font-display text-brand-navy">Harbor Sunset UI</h1>
                </div>
                <hr className="border-slate-100" />
                <div>
                  <span className="font-mono text-[9px] text-slate-400 font-bold block mb-1">FONT-H1</span>
                  <h1 className="font-h1 text-brand-navy">Mission 01 - Port State Control</h1>
                </div>
                <hr className="border-slate-100" />
                <div>
                  <span className="font-mono text-[9px] text-slate-400 font-bold block mb-1">FONT-H2</span>
                  <h2 className="font-h2 text-brand-navy">Ship Compartment Review</h2>
                </div>
                <hr className="border-slate-100" />
                <div>
                  <span className="font-mono text-[9px] text-slate-400 font-bold block mb-1">FONT-H3</span>
                  <h3 className="font-h3 text-brand-navy">Emergency Fire Safety Checklist</h3>
                </div>
                <hr className="border-slate-100" />
                <div>
                  <span className="font-mono text-[9px] text-slate-400 font-bold block mb-1">FONT-H4</span>
                  <h4 className="font-h4 text-brand-blue">Active Safety Deficiencies found</h4>
                </div>
                <hr className="border-slate-100" />
                <div>
                  <span className="font-mono text-[9px] text-slate-400 font-bold block mb-1">FONT-BODY-LG</span>
                  <p className="font-body-lg text-slate-700">Seafarers are required to perform daily safety equipment tests and maintain proper emergency response preparedness logs.</p>
                </div>
                <hr className="border-slate-100" />
                <div>
                  <span className="font-mono text-[9px] text-slate-400 font-bold block mb-1">FONT-BODY</span>
                  <p className="font-body text-slate-600">The vessel must keep safety valves free of corrosion at all times. Failure to clear check valves could result in detention.</p>
                </div>
                <hr className="border-slate-100" />
                <div>
                  <span className="font-mono text-[9px] text-slate-400 font-bold block mb-1">FONT-SMALL</span>
                  <p className="font-small text-slate-500">Note: All lifeboat drills must be logged in page 12 of the official logbook before inspectors board.</p>
                </div>
                <hr className="border-slate-100" />
                <div>
                  <span className="font-mono text-[9px] text-slate-400 font-bold block mb-1">FONT-CAPTION</span>
                  <p className="font-caption text-brand-coral font-bold">Priority Safety Action REQUIRED</p>
                </div>
              </div>
            </div>

            {/* Shadows and Elevation */}
            <div>
              <h3 className="font-h3 text-brand-navy mb-4 font-mono text-xs uppercase tracking-wider">Elevation (Soft Shadows)</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 rounded-[16px] p-5 shadow-none text-left">
                  <span className="font-mono text-[10px] text-slate-400 block mb-1">SHADOW-NONE</span>
                  <p className="text-xs font-semibold text-brand-navy">Flat Container</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-[16px] p-5 shadow-small text-left">
                  <span className="font-mono text-[10px] text-slate-400 block mb-1">SHADOW-SMALL</span>
                  <p className="text-xs font-semibold text-brand-navy">Elevation Small</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-[16px] p-5 shadow-medium text-left">
                  <span className="font-mono text-[10px] text-slate-400 block mb-1">SHADOW-MEDIUM</span>
                  <p className="text-xs font-semibold text-brand-navy">Elevation Medium</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-[16px] p-5 shadow-large text-left">
                  <span className="font-mono text-[10px] text-slate-400 block mb-1">SHADOW-LARGE</span>
                  <p className="text-xs font-semibold text-brand-navy">Elevation Large</p>
                </div>
              </div>
            </div>
          </SectionContainer>
        )}

        {/* Category: Buttons & Cards */}
        {activeCategory === 'buttons-cards' && (
          <SectionContainer title="Buttons & Cards" subtitle="Interactive buttons and card layout widgets.">
            {/* Button Layouts */}
            <div className="mb-8">
              <h3 className="font-h3 text-brand-navy mb-4 font-mono text-xs uppercase tracking-wider">Button Variations</h3>
              <div className="flex flex-wrap gap-3 bg-white border border-slate-200 p-6 rounded-[12px] shadow-small">
                <Button variant="primary">Primary (Sunset Gold)</Button>
                <Button variant="secondary">Secondary (Ocean Blue)</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost Link</Button>
                <Button variant="primary" isLoading>Loading State</Button>
                <Button variant="secondary" disabled>Disabled State</Button>
              </div>
            </div>

            {/* Card Layouts */}
            <div>
              <h3 className="font-h3 text-brand-navy mb-4 font-mono text-xs uppercase tracking-wider">Card Variations</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card variant="standard" padding="standard" className="text-left">
                  <span className="font-caption text-brand-blue font-bold">Standard Card</span>
                  <h4 className="font-h4 text-brand-navy mt-1">Crew List Review</h4>
                  <p className="text-xs text-slate-500 mt-2">Provides standard flat background layout with subtle bounds border.</p>
                </Card>

                <Card variant="elevated" padding="standard" className="text-left">
                  <span className="font-caption text-brand-gold font-bold">Elevated Card</span>
                  <h4 className="font-h4 text-brand-navy mt-1">Voyage Checklist</h4>
                  <p className="text-xs text-slate-500 mt-2">Includes shadow elevations to float above page background layouts.</p>
                </Card>

                <Card variant="interactive" padding="standard" className="text-left">
                  <span className="font-caption text-brand-coral group-hover:text-brand-gold font-bold transition-colors duration-300">Interactive Card</span>
                  <h4 className="font-h4 text-brand-navy group-hover:text-white mt-1 transition-colors duration-300">Launch PSC Mission</h4>
                  <p className="text-xs text-slate-500 group-hover:text-slate-200 mt-2 transition-colors duration-300">Triggers hover transitions, borders color changes, and scales down slightly on clicks.</p>
                </Card>
              </div>
            </div>
          </SectionContainer>
        )}

        {/* Category: Form Controls */}
        {activeCategory === 'forms' && (
          <SectionContainer title="Form Controls" subtitle="Input elements, checkboxes, toggles and dropdown selections.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white border border-slate-200 p-6 rounded-[16px] shadow-small">
              {/* Inputs Column */}
              <div className="space-y-4">
                <TextInput label="Vessel Name" placeholder="e.g. Pacific Voyager" defaultValue="Sea Voyager" />
                <SearchField label="Search Deficiencies" placeholder="Type to search (e.g. fire pump)..." />
                <PasswordInput label="Inspector Signature Passcode" placeholder="••••••••" defaultValue="12345" />
                <Dropdown
                  label="Vessel Department"
                  options={[
                    { label: 'Deck Department', value: 'deck' },
                    { label: 'Engine Department', value: 'engine' },
                    { label: 'Catering Department', value: 'catering' },
                  ]}
                  value={dropdownVal}
                  onChange={(e) => setDropdownVal(e.target.value)}
                />
              </div>

              {/* Toggles & Checkbox column */}
              <div className="space-y-6 text-left">
                <Textarea label="PSC Inspection Notes" placeholder="Enter findings, annotations, or detainable observations..." />
                
                <div className="border border-slate-100 rounded-[12px] p-4 space-y-4">
                  <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider block">Selectors & Checkboxes</span>
                  
                  <Checkbox
                    label="Emergency drill successfully completed"
                    checked={checkboxVal}
                    onChange={(e) => setCheckboxVal(e.target.checked)}
                  />

                  <div className="flex gap-4 mt-2">
                    <RadioButton
                      label="Engine Drills"
                      name="showcase-radio"
                      checked={radioVal === 'option-1'}
                      onChange={() => setRadioVal('option-1')}
                    />
                    <RadioButton
                      label="Deck Drills"
                      name="showcase-radio"
                      checked={radioVal === 'option-2'}
                      onChange={() => setRadioVal('option-2')}
                    />
                  </div>
                </div>

                <div className="border border-slate-100 rounded-[12px] p-4">
                  <ToggleSwitch
                    label="Activate Emergency Alert Protocol Mode"
                    checked={toggleVal}
                    onChange={(e) => setToggleVal(e.target.checked)}
                  />
                </div>
              </div>
            </div>
          </SectionContainer>
        )}

        {/* Category: Navigation Elements */}
        {activeCategory === 'navigation' && (
          <SectionContainer title="Navigation Elements" subtitle="Tab configurations, breadcrumbs, navbars, and sidebar controls.">
            <div className="space-y-6">
              {/* Breadcrumb Trail */}
              <div>
                <span className="font-caption text-slate-400 block mb-2 font-semibold">Breadcrumb Trail</span>
                <Breadcrumb
                  steps={[
                    { label: 'Bridge Dashboard', href: '#' },
                    { label: 'Missions Library', href: '#' },
                    { label: 'Port State Control (PSC)' },
                  ]}
                />
              </div>

              {/* Horizontal Navbar */}
              <div>
                <span className="font-caption text-slate-400 block mb-2 font-semibold">Horizontal Navbar Mockup</span>
                <Navbar
                  items={[
                    { label: 'Vessel Overview', href: '#', active: true },
                    { label: 'Certificate Logbook', href: '#' },
                    { label: 'Drills Library', href: '#' },
                  ]}
                />
              </div>

              {/* Tab Selector */}
              <div>
                <span className="font-caption text-slate-400 block mb-2 font-semibold">Underline Tabs Selection</span>
                <div className="bg-white border border-slate-200/80 p-5 rounded-[12px] shadow-small">
                  <Tabs
                    activeTab={activeTab}
                    onChange={setActiveTab}
                    items={[
                      { id: 'info', label: 'Inspector Profile', badge: 1 },
                      { id: 'checklist', label: 'Safety Checklist', badge: 4 },
                      { id: 'remedial', label: 'Remedial Actions' },
                    ]}
                  />
                  
                  <div className="mt-4 text-left text-xs text-slate-600">
                    {activeTab === 'info' && <p>Inspector: Chief Officer Henderson. Authority: Port of Rotterdam Authority.</p>}
                    {activeTab === 'checklist' && <p>4 items are remaining in your active deck walkthrough survey checklist.</p>}
                    {activeTab === 'remedial' && <p>Log actions to clear deficiencies. Clear entries before departure clearance.</p>}
                  </div>
                </div>
              </div>
            </div>
          </SectionContainer>
        )}

        {/* Category: Feedback & Modals */}
        {activeCategory === 'feedback' && (
          <SectionContainer title="Feedback & Modals" subtitle="Alerts, badges, status indicators, progress bars, and modal triggers.">
            <div className="space-y-6">
              
              {/* Alert Banners */}
              <div className="space-y-3">
                <span className="font-caption text-slate-400 block text-left font-semibold">Alert Banners</span>
                <Alert
                  variant="info"
                  title="Inspection Active"
                  description="PSC Inspector has boarded the vessel and is reviewing safety credentials in the captain cabin."
                />
                <Alert
                  variant="warning"
                  title="Detainable Deficiency Risk"
                  description="Lifeboat quick release gear is corroded. Clear or remedy before Port Authority issues a detention."
                />
                <Alert
                  variant="error"
                  title="Inspection Detention Issued"
                  description="Critical machinery failure: Emergency Fire Pump fails to start on local controls."
                />
              </div>

              {/* Badge & Status chips */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white border border-slate-200/80 p-6 rounded-[12px] shadow-small text-left">
                <div>
                  <span className="font-caption text-slate-400 block mb-2 font-semibold">Pill Badges</span>
                  <div className="flex gap-2">
                    <Tooltip text="Safety of Life at Sea (Convention)">
                      <Badge variant="navy">SOLAS</Badge>
                    </Tooltip>
                    <Tooltip text="Prevention of Pollution from Ships">
                      <Badge variant="blue">MARPOL</Badge>
                    </Tooltip>
                    <Tooltip text="Standards of Watchkeeping & Training">
                      <Badge variant="gold">STCW</Badge>
                    </Tooltip>
                    <Tooltip text="International Ship & Port Security Code">
                      <Badge variant="coral">ISPS</Badge>
                    </Tooltip>
                  </div>
                </div>

                <div>
                  <span className="font-caption text-slate-400 block mb-2 font-semibold">Status Chips</span>
                  <div className="flex gap-2 flex-wrap">
                    <StatusChip status="passed" label="Clear / Ok" />
                    <StatusChip status="pending" label="Pending" />
                    <StatusChip status="warning" label="Observation" />
                    <StatusChip status="failed" label="Detained" />
                  </div>
                </div>
              </div>

              {/* Progress Bars */}
              <div className="bg-white border border-slate-200/80 p-6 rounded-[12px] shadow-small text-left space-y-4">
                <span className="font-caption text-slate-400 block font-semibold">Progress Bars</span>
                <ProgressBar value={75} label="Mission Completeness" showValueLabel />
                <ProgressBar value={35} label="Lifeboat Drill Preparation Checklist" showValueLabel />
              </div>

              {/* Trigger Modals and Toasts */}
              <div className="flex gap-4">
                <Button variant="primary" onClick={() => setIsModalOpen(true)}>Trigger Dialog Modal</Button>
                <Button variant="secondary" onClick={() => setIsToastOpen(true)}>Trigger Toast Notification</Button>
              </div>

              {/* Modal Component instance */}
              <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Vessel Detention Protocol"
                footerActions={
                  <>
                    <Button variant="outline" onClick={() => setIsModalOpen(false)}>Acknowledge</Button>
                    <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Submit Remedial Plan</Button>
                  </>
                }
              >
                <div className="space-y-3">
                  <p className="font-bold text-brand-coral">detainment warning issued under SOLAS Regulation 19.</p>
                  <p className="text-xs text-slate-500">The vessel will not receive customs clearance for port departure until all engine room bilge oil separation valves have been replaced and certified.</p>
                </div>
              </Modal>

              {/* Toast Notification instance */}
              <Toast
                message="Deficiency Logged"
                description="Lifeboat release gear observation has been added to checklist record."
                visible={isToastOpen}
                onClose={() => setIsToastOpen(false)}
              />
            </div>
          </SectionContainer>
        )}

        {/* Category: Data & Timelines */}
        {activeCategory === 'data' && (
          <SectionContainer title="Data & Timelines" subtitle="Tables, step timelines, accordions, and skeleton loading indicators.">
            <div className="space-y-6">
              
              {/* Timeline layout */}
              <div className="bg-white border border-slate-200/80 p-6 rounded-[12px] shadow-small text-left">
                <span className="font-caption text-slate-400 block mb-4 font-semibold">PSC Inspection timeline</span>
                <Timeline steps={timelineSteps} />
              </div>

              {/* Responsive Table */}
              <div>
                <span className="font-caption text-slate-400 block text-left mb-2 font-semibold">Inspection Log Table</span>
                <Table headers={tableHeaders} rows={tableRows} />
              </div>

              {/* Accordion Panels */}
              <div>
                <span className="font-caption text-slate-400 block text-left mb-2 font-semibold">FAQ Accordion</span>
                <Accordion items={accordionItems} />
              </div>

              {/* Pagination controls */}
              <div className="bg-white border border-slate-200/80 p-4 rounded-[12px] shadow-small flex items-center justify-center">
                <Pagination current={currentPage} total={5} onChange={setCurrentPage} />
              </div>

              {/* Empty state & loaders */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <EmptyState
                  title="No outstanding notifications"
                  description="All logged inspection findings have been cleared by the chief engineering department."
                  action={<Button variant="outline" size="sm">Reload Records</Button>}
                />
                
                <div className="bg-white border border-slate-200/80 p-6 rounded-[12px] shadow-small text-left flex flex-col justify-center">
                  <span className="font-caption text-slate-400 block mb-3 font-semibold">Skeleton Loaders</span>
                  <SkeletonLoader />
                </div>
              </div>
            </div>
          </SectionContainer>
        )}
      </div>
    </div>
  )
}
