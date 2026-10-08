# Burmese AI Video Recap Studio — Product Design

## Goal
Build a Windows desktop app for generating compact Burmese recap videos from long-form source content through a workflow of subtitle import, scene selection, AI storytelling, Burmese TTS, and FFmpeg export.

## Workflow
1. Import video and source subtitles.
2. Create a proxy preview and project metadata.
3. Review glossary and story markers.
4. Generate Burmese narration in a controlled, length-aware process.
5. Match narration to clips and cue ranges.
6. Render with FFmpeg and export MP4.

## Architecture
- Frontend: React + TypeScript in a Tauri shell.
- Desktop runtime: Tauri 2, Rust, WebView2.
- Media processing: FFmpeg + FFprobe sidecars.
- Local metadata: SQLite with WAL mode.
- AI adapters: OpenRouter, Ollama, local inference, cloud TTS.

## Risks and mitigations
- Burmese TTS quality: validate with native-speaker sample reviews before full production use.
- Subtitle shaping: enforce Unicode + libass + HarfBuzz verification in the render pipeline.
- Preview sync: use proxy video + waveform data for deterministic editing.

## Success criteria
- Source video imports without crashing on an 8GB Windows laptop.
- User can review and edit clip-to-script mapping before rendering.
- Export creates a finished MP4 recap with synchronized narration and subtitle overlays.
