import { useEffect, useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { open } from '@tauri-apps/plugin-dialog'
import './App.css'

type Section = 'Overview' | 'Project' | 'Subtitles' | 'Recap' | 'Timeline' | 'Render'

type ProjectStatus = {
  project_name: string
  source_path: string
  target_duration: string
  output_resolution: string
  video_duration: string
  narration_segments: number
  total_clips: number
  render_status: string
}

const workflowSteps = [
  'Import media & subtitles',
  'AI analysis & glossary',
  'Script review & clip mapping',
  'Burmese TTS + timing',
  'Render final recap',
]

const navigationItems: Section[] = ['Overview', 'Project', 'Subtitles', 'Recap', 'Timeline', 'Render']

const segmentRows = [
  { name: 'Scene 01', start: '00:00:05', end: '00:00:28', duration: '00:00:23', cue: 'Cue 12-17', status: 'Ready' },
  { name: 'Scene 02', start: '00:00:42', end: '00:01:06', duration: '00:00:24', cue: 'Cue 18-21', status: 'Review' },
  { name: 'Scene 03', start: '00:01:18', end: '00:01:54', duration: '00:00:36', cue: 'Cue 26-31', status: 'Approved' },
  { name: 'Scene 04', start: '00:02:08', end: '00:02:39', duration: '00:00:31', cue: 'Cue 35-39', status: 'Queued' },
]

const highlights = [
  'Burmese Unicode-safe output with Zawgyi conversion support',
  'Clip-first recap workflow: narration tied to source ranges, not just subtitles',
  'Proxy playback and FFmpeg render pipeline for long-form source videos',
]

const fallbackStatus: ProjectStatus = {
  project_name: 'Burmese AI Video Recap Studio',
  source_path: 'D:/media/episode_03.mp4',
  target_duration: '03:40',
  output_resolution: '1080p',
  video_duration: '00:42:18',
  narration_segments: 12,
  total_clips: 17,
  render_status: 'Ready for human review',
}

function App() {
  const [status, setStatus] = useState<ProjectStatus>(fallbackStatus)
  const [activeSection, setActiveSection] = useState<Section>('Overview')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    void invoke<ProjectStatus>('get_app_status')
      .then((value) => setStatus(value))
      .catch(() => setStatus(fallbackStatus))
  }, [])

  useEffect(() => {
    if (!notice) return
    const timeout = window.setTimeout(() => setNotice(''), 5000)
    return () => window.clearTimeout(timeout)
  }, [notice])

  async function openSource() {
    try {
      const selectedPath = await open({
        multiple: false,
        directory: false,
        filters: [{ name: 'Video files', extensions: ['mp4', 'mkv', 'mov', 'webm', 'avi'] }],
      })

      if (!selectedPath || Array.isArray(selectedPath)) return

      setStatus((current) => ({
        ...current,
        source_path: selectedPath,
        video_duration: 'Not analyzed',
        narration_segments: 0,
        total_clips: 0,
        render_status: 'Source selected — ready for analysis',
      }))
      setNotice('Video source selected. Media analysis is not connected yet.')
    } catch (error) {
      setNotice(`Could not open the video picker: ${String(error)}`)
    }
  }

  function startRender() {
    setNotice('Rendering is not available yet. The recap and FFmpeg render pipeline has not been connected.')
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark">MM</div>
          <div>
            <p className="eyebrow">Desktop Studio</p>
            <h1>MMNext Recap</h1>
          </div>
        </div>

        <nav className="nav-list" aria-label="Primary navigation">
          {navigationItems.map((item) => (
            <button
              key={item}
              className={`nav-item ${activeSection === item ? 'active' : ''}`}
              type="button"
              aria-current={activeSection === item ? 'page' : undefined}
              onClick={() => setActiveSection(item)}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="sidebar-card">
          <span className="section-label">Project</span>
          <strong>{status.project_name}</strong>
          <small>{status.source_path}</small>
          <div className="meta-row">
            <span>Target</span>
            <b>{status.target_duration}</b>
          </div>
          <div className="meta-row">
            <span>Output</span>
            <b>{status.output_resolution}</b>
          </div>
        </div>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Project status</p>
            <h2>{status.render_status}</h2>
          </div>
          <div className="actions">
            <button className="ghost" type="button" onClick={() => void openSource()}>Open source</button>
            <button className="primary" type="button" onClick={startRender}>Render recap</button>
          </div>
        </header>

        {activeSection === 'Overview' && <>
        <section className="hero-panel">
          <div className="hero-copy">
            <span className="pill">AI recap workflow</span>
            <h3>Burmese narration + clip selection + final export</h3>
            <p>
              Build a short recap from a long source video by pairing every narration segment
              with valid source footage and aligning it to a Burmese TTS timeline.
            </p>
          </div>

          <div className="metrics">
            <div className="metric-card">
              <span>Source video</span>
              <strong>{status.video_duration}</strong>
            </div>
            <div className="metric-card">
              <span>Segments</span>
              <strong>{status.narration_segments}</strong>
            </div>
            <div className="metric-card">
              <span>Clip edits</span>
              <strong>{status.total_clips}</strong>
            </div>
          </div>
        </section>

        <div className="two-column">
          <section className="panel">
            <div className="panel-header">
              <h3>Workflow</h3>
              <span className="section-label">Pipeline</span>
            </div>
            <div className="workflow-list">
              {workflowSteps.map((step, index) => (
                <div key={step} className={`workflow-item ${index === 3 ? 'active' : ''}`}>
                  <span className="step-index">{index + 1}</span>
                  <div>
                    <strong>{step}</strong>
                    <small>{index < 3 ? 'Ready' : 'In progress'}</small>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="panel-header">
              <h3>Highlights</h3>
              <span className="section-label">Safety</span>
            </div>
            <ul className="bullet-list">
              {highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>

        <section className="panel timeline-panel">
          <div className="panel-header">
            <h3>Clip selection</h3>
            <span className="section-label">Timeline preview</span>
          </div>

          <table>
            <thead>
              <tr>
                <th>Segment</th>
                <th>Start</th>
                <th>End</th>
                <th>Duration</th>
                <th>Cue range</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {segmentRows.map((row) => (
                <tr key={row.name}>
                  <td>{row.name}</td>
                  <td>{row.start}</td>
                  <td>{row.end}</td>
                  <td>{row.duration}</td>
                  <td>{row.cue}</td>
                  <td><span className="status-pill">{row.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        </>}

        {activeSection === 'Project' && (
          <section className="panel section-page">
            <div className="panel-header">
              <h3>Project media</h3>
              <span className="section-label">Source</span>
            </div>
            <p>Choose a source video for this recap project.</p>
            <div className="project-details">
              <span>Source file</span><strong>{status.source_path}</strong>
              <span>Duration</span><strong>{status.video_duration}</strong>
              <span>Target length</span><strong>{status.target_duration}</strong>
              <span>Output</span><strong>{status.output_resolution}</strong>
            </div>
            <button className="primary" type="button" onClick={() => void openSource()}>Choose video</button>
          </section>
        )}

        {activeSection === 'Subtitles' && (
          <section className="panel section-page">
            <div className="panel-header"><h3>Subtitle review</h3><span className="section-label">Not connected</span></div>
            <p>Subtitle import and Burmese text review are not implemented yet. The source video can be selected from the Project page.</p>
          </section>
        )}

        {activeSection === 'Recap' && (
          <section className="panel section-page">
            <div className="panel-header"><h3>Recap script</h3><span className="section-label">Not connected</span></div>
            <p>AI script generation and narration editing are not implemented yet.</p>
            <div className="project-details">
              <span>Narration segments</span><strong>{status.narration_segments}</strong>
              <span>Mapped clips</span><strong>{status.total_clips}</strong>
            </div>
          </section>
        )}

        {activeSection === 'Timeline' && (
          <section className="panel section-page">
            <div className="panel-header"><h3>Clip selection</h3><span className="section-label">Timeline preview</span></div>
            <p>Clip editing and timeline controls are not connected yet.</p>
            <div className="table-scroll">
              <table>
                <thead><tr><th>Segment</th><th>Start</th><th>End</th><th>Duration</th><th>Cue range</th><th>Status</th></tr></thead>
                <tbody>{segmentRows.map((row) => (
                  <tr key={row.name}><td>{row.name}</td><td>{row.start}</td><td>{row.end}</td><td>{row.duration}</td><td>{row.cue}</td><td><span className="status-pill">{row.status}</span></td></tr>
                ))}</tbody>
              </table>
            </div>
          </section>
        )}

        {activeSection === 'Render' && (
          <section className="panel section-page">
            <div className="panel-header"><h3>Export recap</h3><span className="section-label">Not connected</span></div>
            <p>The FFmpeg render pipeline is not implemented yet. No output file will be created at this stage.</p>
            <button className="primary" type="button" onClick={startRender}>Render recap</button>
          </section>
        )}
      </main>
      {notice && <div className="notice" role="status">{notice}</div>}
    </div>
  )
}

export default App
