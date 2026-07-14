import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '@/contexts/AppContext'
import { briefingConfigs } from '../config/briefingConfig'
import { blockRegistry } from '../services/BlockRegistry'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/Feedback'
import { 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Compass, 
  AlertCircle, 
  ArrowRight, 
  Lock, 
  Unlock, 
  ArrowLeft, 
  Play,
  Trophy,
  Activity,
  FileCheck
} from 'lucide-react'
import type { BriefingBlock } from '../types'

// ==========================================
// 1. DEFAULT BLOCK RENDERING PLUGINS
// ==========================================

const IntroductionBlock: React.FC<{ block: BriefingBlock }> = ({ block }) => {
  return (
    <div className="space-y-4 text-left">
      {block.title && (
        <h2 className="text-xl md:text-2xl font-extrabold text-brand-navy tracking-tight leading-tight">
          {block.title}
        </h2>
      )}
      {block.content && (
        <p className="text-sm text-slate-600 leading-relaxed font-sans mt-2">
          {block.content}
        </p>
      )}
    </div>
  )
}

const ObjectivesBlock: React.FC<{ block: BriefingBlock }> = ({ block }) => {
  const objectives = block.objectives || block.metadata?.objectives || []
  return (
    <div className="space-y-4 bg-slate-50 border border-slate-200/80 rounded-xl p-5 text-left">
      {block.title && (
        <h3 className="font-h3 text-brand-navy text-sm font-bold flex items-center gap-2 mb-2">
          <BookOpen className="h-4 w-4 text-brand-blue" /> 
          {block.title}
        </h3>
      )}
      {block.content && <p className="text-xs text-slate-500 italic mb-3">{block.content}</p>}
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
        {objectives.map((obj: string, i: number) => (
          <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
            <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{obj}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

const InfoCardBlock: React.FC<{ block: BriefingBlock }> = ({ block }) => {
  return (
    <div className="bg-gradient-to-br from-brand-navy to-slate-900 text-slate-100 rounded-2xl p-6 shadow-medium relative overflow-hidden border border-brand-blue/30 text-left my-4">
      <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none translate-x-4 translate-y-4">
        <Compass className="h-40 w-40" />
      </div>
      <div className="relative z-10 space-y-3">
        {block.title && (
          <h3 className="font-mono text-brand-gold uppercase tracking-wider text-xs font-bold">
            {block.title}
          </h3>
        )}
        {block.content && (
          <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-sans">
            {block.content}
          </p>
        )}
      </div>
    </div>
  )
}

const ImageTextBlock: React.FC<{ block: BriefingBlock }> = ({ block }) => {
  const asset = block.assets?.[0]
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center text-left my-4">
      <div className="md:col-span-3 space-y-3">
        {block.title && <h3 className="font-h3 text-brand-navy text-base leading-snug font-bold">{block.title}</h3>}
        {block.content && <p className="text-xs text-slate-600 leading-relaxed font-sans">{block.content}</p>}
      </div>
      {asset && (
        <div className="md:col-span-2 space-y-1.5 flex flex-col items-center">
          <div className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-center shadow-inner">
            {asset.url.includes('bilge') ? (
              <div className="w-full aspect-[4/3] bg-slate-900 rounded border border-slate-700 flex flex-col justify-between p-3 font-mono text-[9px] text-brand-gold select-none">
                <div className="border border-slate-700 bg-slate-950/40 p-1 text-center font-bold uppercase tracking-wider text-slate-200">MARPOL Bilge Separator Loop</div>
                <div className="flex justify-between items-center gap-1 my-3">
                  <div className="border border-brand-blue/60 p-1 rounded text-slate-300">Bilge Sump</div>
                  <div className="h-px bg-slate-700 flex-1 relative">
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[7px] text-slate-500 uppercase">Oil Sensor</span>
                  </div>
                  <div className="border border-emerald-600 p-1 rounded text-emerald-400 bg-emerald-950/20 font-bold">15ppm Limit</div>
                </div>
                <div className="flex justify-between text-[7px] text-slate-400 px-1 border-t border-slate-800 pt-1.5">
                  <span className="text-emerald-500 font-bold">&lt;15ppm: Overboard</span>
                  <span className="text-brand-coral font-bold">&gt;15ppm: Recirculate</span>
                </div>
              </div>
            ) : (
              <div className="w-full aspect-[4/3] bg-slate-900 rounded border border-slate-700 flex flex-col justify-between p-3 font-mono text-[9px] text-slate-300 select-none">
                <div className="border border-slate-700 bg-slate-950/40 p-1 text-center font-bold text-brand-gold uppercase tracking-wider">MLC 2006 Fatigue Limits</div>
                <div className="space-y-1.5 my-2">
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-400">Rest in 24 Hours:</span>
                    <span className="text-emerald-400 font-bold">Min 10 Hours</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-400">Rest in 7 Days:</span>
                    <span className="text-emerald-400 font-bold">Min 77 Hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Max Splits:</span>
                    <span className="text-slate-200">2 periods (1 is &gt;6h)</span>
                  </div>
                </div>
                <div className="border-t border-slate-700 pt-1 text-[7px] text-emerald-500 font-bold uppercase text-center tracking-wider">
                  Status: Compliant Audit Checked
                </div>
              </div>
            )}
          </div>
          {asset.caption && (
            <span className="text-[10px] text-slate-400 italic text-center leading-normal px-2">
              {asset.caption}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

const NoteCalloutBlock: React.FC<{ block: BriefingBlock }> = ({ block }) => {
  const calloutType = block.metadata?.calloutType || 'info'
  const styles = calloutType === 'danger'
    ? 'bg-red-50/50 border-red-200 text-red-800'
    : calloutType === 'warning'
      ? 'bg-amber-50/50 border-amber-200 text-amber-800'
      : calloutType === 'success'
        ? 'bg-emerald-50/50 border-emerald-200 text-emerald-800'
        : 'bg-blue-50/50 border-blue-200 text-blue-800'

  return (
    <div className={`p-4 border rounded-xl flex gap-3 text-xs leading-relaxed my-4 text-left ${styles}`}>
      <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
      <div>
        {block.title && <strong className="block font-bold mb-0.5">{block.title}</strong>}
        {block.content && <p className="font-sans text-slate-700 mt-1">{block.content}</p>}
      </div>
    </div>
  )
}

// Register default blocks in the registry on import
blockRegistry.register('introduction', IntroductionBlock)
blockRegistry.register('learning_objectives', ObjectivesBlock)
blockRegistry.register('info_card', InfoCardBlock)
blockRegistry.register('image_text', ImageTextBlock)
blockRegistry.register('note_callout', NoteCalloutBlock)

// ==========================================
// 2. CORE BRIEFING ENGINE CONTAINER
// ==========================================

export const MissionBriefingEngine: React.FC = () => {
  const { missionId } = useParams<{ missionId: string }>()
  const navigate = useNavigate()
  const { theoryProgressMap, updateTheoryProgress, completeTheory } = useApp()

  const briefingConfig = missionId ? briefingConfigs[missionId] : null

  // State values
  const [activeSectionId, setActiveSectionId] = useState<string>('')
  const [durationSeconds, setDurationSeconds] = useState<number>(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({})
  const [assessmentSubmitted, setAssessmentSubmitted] = useState<boolean>(false)
  const [showAssessment, setShowAssessment] = useState<boolean>(false)
  const [attempts, setAttempts] = useState<number>(0)
  const [quizError, setQuizError] = useState<string | null>(null)

  const durationRef = useRef(0)

  // Redirect to Simulation Hub if configuration not found
  useEffect(() => {
    if (!briefingConfig) {
      navigate('/simulation')
    }
  }, [briefingConfig, navigate])

  // Restore resume state and initialize values
  useEffect(() => {
    if (!briefingConfig || !missionId) return

    const progress = theoryProgressMap[missionId]
    if (progress) {
      if (progress.currentSectionId) {
        setActiveSectionId(progress.currentSectionId)
      } else {
        setActiveSectionId(briefingConfig.sections[0].id)
      }
      setSelectedAnswers(progress.answers || {})
      setAttempts(progress.assessmentAttempts || 0)
      setDurationSeconds(progress.durationSeconds || 0)
      durationRef.current = progress.durationSeconds || 0

      if (progress.assessmentPassed) {
        setAssessmentSubmitted(true)
      }
    } else {
      setActiveSectionId(briefingConfig.sections[0].id)
    }
  }, [missionId, briefingConfig])

  // Track study duration ticking
  useEffect(() => {
    const timer = setInterval(() => {
      durationRef.current += 1
      setDurationSeconds(durationRef.current)
    }, 1000)

    return () => {
      clearInterval(timer)
      // Save duration on unmount
      if (missionId && briefingConfig) {
        updateTheoryProgress(missionId, {
          durationSeconds: durationRef.current
        })
      }
    }
  }, [missionId])

  if (!briefingConfig || !missionId) return null

  // Keep track of sections that have been viewed
  const progress = theoryProgressMap[missionId]
  const readSectionIds = progress && progress.status === 'completed'
    ? briefingConfig.sections.map(s => s.id)
    : [...new Set([...(progress?.readSectionIds || []), activeSectionId])]

  const allSectionsViewed = briefingConfig.sections.every(
    (s) => (progress && progress.status === 'completed') || readSectionIds.includes(s.id)
  )
  
  const currentSection = briefingConfig.sections.find((s) => s.id === activeSectionId)
  const currentSectionIndex = briefingConfig.sections.findIndex((s) => s.id === activeSectionId)
  
  // Progress calculations
  const progressPercentage = briefingConfig.sections.length > 0
    ? Math.round((readSectionIds.length / briefingConfig.sections.length) * 100)
    : 0

  const handleSectionSelect = (sectionId: string) => {
    setActiveSectionId(sectionId)
    setShowAssessment(false)

    // Save resume parameters to context
    const nextRead = [...new Set([...(progress?.readSectionIds || []), activeSectionId, sectionId])]
    const nextPercentage = Math.round((nextRead.length / briefingConfig.sections.length) * 100)

    updateTheoryProgress(missionId, {
      currentSectionId: sectionId,
      progressPercentage: nextPercentage,
      status: 'in_progress',
      readSectionIds: nextRead
    })
  }

  const handleNextSection = () => {
    if (currentSectionIndex < briefingConfig.sections.length - 1) {
      const nextId = briefingConfig.sections[currentSectionIndex + 1].id
      handleSectionSelect(nextId)
    } else if (allSectionsViewed) {
      setShowAssessment(true)
    }
  }

  const handlePrevSection = () => {
    if (showAssessment) {
      setShowAssessment(false)
    } else if (currentSectionIndex > 0) {
      const prevId = briefingConfig.sections[currentSectionIndex - 1].id
      handleSectionSelect(prevId)
    }
  }

  // Quiz assessment logic
  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    if (assessmentSubmitted && progress?.assessmentPassed) return // Block change if passed
    setSelectedAnswers((prev) => {
      const next = { ...prev, [questionId]: optionIndex }
      updateTheoryProgress(missionId, { answers: next })
      return next
    })
    setQuizError(null)
  }

  const handleSubmitQuiz = () => {
    const questions = briefingConfig.assessment.questions
    const answeredCount = Object.keys(selectedAnswers).length

    if (answeredCount < questions.length) {
      setQuizError('Please answer all questions before submitting.')
      return
    }

    const nextAttempts = attempts + 1
    setAttempts(nextAttempts)

    let correctCount = 0
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount++
      }
    })

    const score = Math.round((correctCount / questions.length) * 100)
    const passed = score >= briefingConfig.unlockRules.requiredScorePercent

    updateTheoryProgress(missionId, {
      assessmentAttempts: nextAttempts,
      assessmentHighScore: Math.max(progress?.assessmentHighScore || 0, score),
      answers: selectedAnswers,
      durationSeconds: durationSeconds,
    })

    if (passed) {
      setAssessmentSubmitted(true)
      completeTheory(missionId)
      setQuizError(null)
    } else {
      setQuizError(`Assessment Failed (${score}%). You must answer all questions correctly (100%) to unlock the simulator. Please review and try again.`)
    }
  }

  const handleResetQuiz = () => {
    setSelectedAnswers({})
    setAssessmentSubmitted(false)
    setQuizError(null)
    updateTheoryProgress(missionId, {
      answers: {},
      assessmentPassed: false
    })
  }

  const formatDuration = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60)
    const secs = totalSecs % 60
    return `${mins}m ${secs}s`
  }

  return (
    <div className="space-y-6 text-left">
      {/* 1. Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/simulation')}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 cursor-pointer"
            aria-label="Back to Simulation Hub"
          >
            <ArrowLeft className="h-4 w-4 text-brand-navy" />
          </button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-brand-gold/15 text-brand-gold border border-brand-gold/25 uppercase">
                {briefingConfig.missionCode} Briefing
              </span>
              <span className="text-xs text-slate-400 font-mono">v{briefingConfig.version}</span>
            </div>
            <h1 className="font-h2 text-brand-navy text-lg mt-1">{briefingConfig.metadata.title}</h1>
          </div>
        </div>

        {/* Dynamic estimated duration & reading timer */}
        <div className="flex items-center gap-4 text-xs text-slate-500 font-mono bg-white border border-slate-200 px-4 py-2 rounded-xl">
          <div className="flex items-center gap-1.5 border-r border-slate-100 pr-3">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span>EST: {briefingConfig.metadata.estimatedDuration}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5 text-brand-blue" />
            <span>TIMER: {formatDuration(durationSeconds)}</span>
          </div>
        </div>
      </div>

      {/* 2. Main Dual-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Column: Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="p-4 bg-slate-900 border border-slate-800 text-slate-100">
            <h3 className="text-xs font-mono font-extrabold text-brand-gold uppercase tracking-wider mb-3">Briefing Modules</h3>
            <div className="space-y-1">
              {briefingConfig.sections.map((section, idx) => {
                const isActive = activeSectionId === section.id && !showAssessment
                const isViewed = readSectionIds.includes(section.id)

                return (
                  <button
                    key={section.id}
                    onClick={() => handleSectionSelect(section.id)}
                    className={`w-full text-left flex items-start gap-2.5 px-3 py-2.5 rounded-xl text-xs transition-all select-none cursor-pointer ${
                      isActive 
                        ? 'bg-brand-blue text-white font-semibold shadow-inner' 
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {isViewed ? (
                      <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <span className="h-4 w-4 rounded-full border border-slate-700 bg-slate-950 flex items-center justify-center font-mono text-[8px] text-slate-500 shrink-0 mt-0.5 font-bold">
                        {idx + 1}
                      </span>
                    )}
                    <span className="truncate leading-normal">{section.title}</span>
                  </button>
                )
              })}

              {/* Assessment Sidebar Trigger */}
              <button
                disabled={!allSectionsViewed}
                onClick={() => setShowAssessment(true)}
                className={`w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs transition-all mt-3 select-none cursor-pointer border ${
                  showAssessment
                    ? 'bg-brand-gold/15 text-brand-gold font-semibold border-brand-gold/30'
                    : allSectionsViewed
                      ? 'text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white bg-slate-950/20'
                      : 'text-slate-600 border-transparent bg-slate-950/10 cursor-not-allowed opacity-50'
                }`}
              >
                {progress?.assessmentPassed ? (
                  <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                ) : allSectionsViewed ? (
                  <Unlock className="h-4 w-4 text-brand-gold shrink-0" />
                ) : (
                  <Lock className="h-4 w-4 text-slate-700 shrink-0" />
                )}
                <span className="font-bold">Readiness Quiz</span>
              </button>
            </div>

            {/* Overall reading completion progress bar */}
            <div className="mt-5 pt-4 border-t border-slate-800 space-y-1.5">
              <div className="flex justify-between text-[9px] font-mono text-slate-400">
                <span>READ COMPLETION</span>
                <span>{progressPercentage}%</span>
              </div>
              <ProgressBar value={progressPercentage} />
            </div>
          </Card>
        </div>

        {/* Right Column: Active Card Viewport */}
        <div className="lg:col-span-3">
          <Card className="p-6 md:p-8 bg-white border border-slate-200/80 shadow-small min-h-[400px] flex flex-col justify-between">
            {/* Viewport Content */}
            <div className="space-y-6">
              {!showAssessment && currentSection ? (
                /* Renders the learning section blocks */
                <div>
                  <div className="border-b border-slate-100 pb-3 mb-4">
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">
                      Section {currentSectionIndex + 1} of {briefingConfig.sections.length}
                    </span>
                    <h2 className="text-lg font-bold text-brand-navy leading-tight mt-0.5">
                      {currentSection.title}
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {currentSection.blocks.map((block) => {
                      const Renderer = blockRegistry.get(block.type)
                      if (!Renderer) {
                        return (
                          <div key={block.id} className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                            Block type error: No registered plugin for `{block.type}`.
                          </div>
                        )
                      }
                      return <Renderer key={block.id} block={block} />
                    })}
                  </div>
                </div>
              ) : (
                /* Renders the assessment panel */
                <div>
                  <div className="border-b border-slate-100 pb-3 mb-5">
                    <span className="text-[10px] font-mono text-brand-gold font-bold uppercase tracking-wider flex items-center gap-1">
                      <FileCheck className="h-3.5 w-3.5" />
                      Readiness Quiz Assessment
                    </span>
                    <h2 className="text-lg font-bold text-brand-navy mt-0.5">
                      {briefingConfig.assessment.title}
                    </h2>
                  </div>

                  {assessmentSubmitted && progress?.assessmentPassed ? (
                    /* 3. SUCCESS / COMPLETE VIEW */
                    <div className="text-center py-6 space-y-4 max-w-lg mx-auto">
                      <div className="flex justify-center">
                        <div className="p-4 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 shadow-inner animate-bounce">
                          <Trophy className="h-12 w-12" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-brand-navy">Mission Briefing Cleared!</h3>
                      <p className="text-slate-500 text-xs leading-relaxed">
                        You have successfully completed the readiness assessment with 100% accuracy. The Port State Control inspector is waiting. You are cleared to launch the maritime simulator engine.
                      </p>

                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-2 gap-3 text-xs text-left max-w-sm mx-auto font-mono">
                        <div>
                          <span className="text-slate-400 block text-[9px] uppercase font-bold">Attempts:</span>
                          <span className="text-slate-800 font-bold">{attempts}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[9px] uppercase font-bold">Study Duration:</span>
                          <span className="text-slate-800 font-bold">{formatDuration(durationSeconds)}</span>
                        </div>
                      </div>

                      <div className="pt-4 flex justify-center gap-3">
                        <Button variant="outline" size="sm" onClick={handleResetQuiz}>
                          Review / Reset Quiz
                        </Button>
                        <Button 
                          variant="primary" 
                          size="sm" 
                          rightIcon={<Play className="h-4 w-4" />}
                          onClick={() => navigate(`/simulation/${briefingConfig.missionId}`)}
                        >
                          Launch Simulator
                        </Button>
                      </div>
                    </div>
                  ) : (
                    /* 4. ACTIVE QUIZ FORM */
                    <div className="space-y-6">
                      {quizError && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
                          <span>{quizError}</span>
                        </div>
                      )}

                      <div className="space-y-5 text-left">
                        {briefingConfig.assessment.questions.map((q, qidx) => {
                          const selectedOption = selectedAnswers[q.id]
                          
                          return (
                            <div key={q.id} className="space-y-2 border-b border-slate-50 pb-5 last:border-b-0 last:pb-0">
                              <h4 className="text-xs font-bold text-brand-navy flex gap-1.5">
                                <span className="font-mono text-brand-blue">{qidx + 1}.</span>
                                <span>{q.question}</span>
                              </h4>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
                                {q.options.map((opt, oidx) => {
                                  const isSelected = selectedOption === oidx
                                  return (
                                    <button
                                      key={oidx}
                                      onClick={() => handleAnswerSelect(q.id, oidx)}
                                      className={`text-left p-2.5 rounded-lg border text-xs transition-colors cursor-pointer select-none ${
                                        isSelected
                                          ? 'border-brand-blue bg-brand-blue/5 text-brand-navy font-bold'
                                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-600'
                                      }`}
                                    >
                                      <span className="font-mono font-bold mr-1.5 text-slate-400">
                                        {String.fromCharCode(65 + oidx)}.
                                      </span>
                                      {opt}
                                    </button>
                                  )
                                })}
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                        <Button variant="outline" size="sm" onClick={handleResetQuiz}>
                          Clear Answers
                        </Button>
                        <Button variant="primary" size="sm" onClick={handleSubmitQuiz}>
                          Submit Assessment
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Viewport Footer Actions */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-5 mt-6">
              {/* Back CTA */}
              <button
                onClick={handlePrevSection}
                disabled={currentSectionIndex === 0 && !showAssessment}
                className={`flex items-center gap-1.5 text-xs font-bold font-mono transition-colors select-none ${
                  currentSectionIndex === 0 && !showAssessment
                    ? 'text-slate-300 cursor-not-allowed'
                    : 'text-brand-blue hover:text-slate-800 cursor-pointer'
                }`}
              >
                <ArrowLeft className="h-4 w-4" />
                <span>PREVIOUS</span>
              </button>

              {/* Next CTA */}
              {!showAssessment ? (
                <button
                  onClick={handleNextSection}
                  disabled={currentSectionIndex === briefingConfig.sections.length - 1 && !allSectionsViewed}
                  className={`flex items-center gap-1.5 text-xs font-bold font-mono transition-colors select-none ${
                    currentSectionIndex === briefingConfig.sections.length - 1 && !allSectionsViewed
                      ? 'text-slate-300 cursor-not-allowed'
                      : 'text-brand-blue hover:text-slate-800 cursor-pointer'
                  }`}
                >
                  <span>{currentSectionIndex === briefingConfig.sections.length - 1 ? 'GO TO ASSESSMENT' : 'CONTINUE'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider pr-1">
                  Ready Quiz Mode
                </span>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
