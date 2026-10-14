import { useState } from 'react'
import { Button, Callout, Field, PageHeader } from '../../components/ui'
import { useToast } from '../../context/ToastContext'
import { PENDING_COPY } from '../../services/api'
import { useLanguage } from '../../context/LanguageContext'

function cloneDoc(doc) {
  return JSON.parse(JSON.stringify(doc))
}

const starter = {
  title: 'Untitled examination paper',
  instructions: 'Attempt all questions. Show working where required.',
  durationMinutes: 180,
  sections: [
    { id: 'a', name: 'Section A', questions: [] },
    { id: 'b', name: 'Section B', questions: [] },
  ],
}

export function PaperEditorPage() {
  const { pushToast } = useToast()
  const { t } = useLanguage()
  const [doc, setDoc] = useState(() => ({
    ...starter,
    title: t(starter.title),
    instructions: t(starter.instructions),
    sections: starter.sections.map((section) => ({ ...section, name: t(section.name) })),
  }))
  const [past, setPast] = useState([])
  const [future, setFuture] = useState([])

  const checkpoint = (next) => {
    setPast((current) => [...current, doc])
    setDoc(next)
    setFuture([])
  }

  const patch = (mutator) => {
    const next = cloneDoc(doc)
    mutator(next)
    setDoc(next)
  }

  const undo = () => {
    if (!past.length) return
    const previous = past[past.length - 1]
    setPast((current) => current.slice(0, -1))
    setFuture((current) => [doc, ...current])
    setDoc(previous)
  }

  const redo = () => {
    if (!future.length) return
    const [next, ...rest] = future
    setPast((current) => [...current, doc])
    setFuture(rest)
    setDoc(next)
  }

  const addLocalQuestion = (sectionId) => {
    const text = window.prompt(t('Instruction or locally typed question (not from the question bank)'))
    if (!text) return
    const next = cloneDoc(doc)
    next.sections.find((item) => item.id === sectionId).questions.push({
      id: crypto.randomUUID(),
      text,
      marks: 1,
      source: 'local-draft',
    })
    checkpoint(next)
  }

  return (
    <>
      <PageHeader
        title="Paper editor"
        description="Local draft workspace: type, add sections, undo structural changes. Question-bank replace and PDF require the API."
        actions={
          <>
            <Button variant="ghost" disabled={!past.length} onClick={undo}>
              Undo
            </Button>
            <Button variant="ghost" disabled={!future.length} onClick={redo}>
              Redo
            </Button>
            <Button variant="ghost" onClick={() => pushToast(PENDING_COPY.pdf)}>
              Preview / PDF
            </Button>
            <Button onClick={() => pushToast(PENDING_COPY.save)}>Save version</Button>
          </>
        }
      />
      <Callout tone="info">
        This is not an auto-generated paper. Answer keys will match a stored paper version when PDF generation is built.
      </Callout>
      <div className="editor-layout" style={{ marginTop: 16 }}>
        <aside className="card">
            <h3>{t('Outline')}</h3>
          {doc.sections.map((section) => (
            <p key={section.id}>
            <strong>{t(section.name)}</strong>
              <span className="stat-hint"> · {section.questions.length} {t('items')}</span>
            </p>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const next = cloneDoc(doc)
              next.sections.push({
                id: crypto.randomUUID(),
                name: `Section ${next.sections.length + 1}`,
                questions: [],
              })
              checkpoint(next)
            }}
          >
            Add section
          </Button>
        </aside>
        <article className="card">
          <Field label="Exam title">
            <input value={doc.title} onChange={(e) => patch((draft) => { draft.title = e.target.value })} />
          </Field>
          <Field label="Instructions">
            <textarea rows={3} value={doc.instructions} onChange={(e) => patch((draft) => { draft.instructions = e.target.value })} />
          </Field>
          {doc.sections.map((section) => (
            <div key={section.id} className="section-block">
              <div className="toolbar">
              <input
                  value={t(section.name)}
                  onChange={(e) =>
                    patch((draft) => {
                      draft.sections.find((item) => item.id === section.id).name = e.target.value
                    })
                  }
                />
                <Button size="sm" variant="ghost" onClick={() => addLocalQuestion(section.id)}>
                  Add typed item
                </Button>
                <Button size="sm" variant="ghost" onClick={() => pushToast('Adding from the question bank requires the API.')}>
                  Add authorized question
                </Button>
              </div>
              {section.questions.length === 0 ? (
                <p className="stat-hint">{t('No items in this section yet.')}</p>
              ) : (
                section.questions.map((question, qIndex) => (
                  <div className="question-row" key={question.id}>
                    <strong>Q{qIndex + 1}</strong>
                    <textarea
                      rows={2}
                      value={question.text}
                      onChange={(e) =>
                        patch((draft) => {
                          draft.sections
                            .find((item) => item.id === section.id)
                            .questions.find((item) => item.id === question.id).text = e.target.value
                        })
                      }
                    />
                    <div className="stack-form">
                      <input
                        type="number"
                        value={question.marks}
                        onChange={(e) =>
                          patch((draft) => {
                            draft.sections
                              .find((item) => item.id === section.id)
                              .questions.find((item) => item.id === question.id).marks = Number(e.target.value)
                          })
                        }
                        style={{ width: 72 }}
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          const next = cloneDoc(doc)
                          const target = next.sections.find((item) => item.id === section.id)
                          target.questions = target.questions.filter((item) => item.id !== question.id)
                          checkpoint(next)
                        }}
                      >
                        Remove
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => pushToast('Replace-from-bank requires the API.')}>
                        Replace
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          ))}
        </article>
        <aside className="card stack-form">
          <h3>{t('Paper meta')}</h3>
          <Field label="Duration (minutes)">
            <input
              type="number"
              value={doc.durationMinutes}
              onChange={(e) => patch((draft) => { draft.durationMinutes = Number(e.target.value) })}
            />
          </Field>
          <p className="stat-hint">{t('Versioning will be stored on the server. Restore will create a new version from a snapshot.')}</p>
          <Button variant="ghost" onClick={() => pushToast(PENDING_COPY.pdf)}>Download paper</Button>
          <Button variant="ghost" onClick={() => pushToast(PENDING_COPY.pdf)}>Download answer key</Button>
          <Button variant="ghost" onClick={() => pushToast(PENDING_COPY.pdf)}>Download both</Button>
        </aside>
      </div>
    </>
  )
}
