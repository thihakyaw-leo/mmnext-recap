use serde::Serialize;

#[derive(Clone, Serialize)]
pub struct ProjectStatus {
  pub project_name: String,
  pub source_path: String,
  pub target_duration: String,
  pub output_resolution: String,
  pub video_duration: String,
  pub narration_segments: usize,
  pub total_clips: usize,
  pub render_status: String,
}

#[tauri::command]
pub fn get_app_status() -> ProjectStatus {
  ProjectStatus {
    project_name: "Burmese AI Video Recap Studio".to_string(),
    source_path: "D:/media/episode_03.mp4".to_string(),
    target_duration: "03:40".to_string(),
    output_resolution: "1080p".to_string(),
    video_duration: "00:42:18".to_string(),
    narration_segments: 12,
    total_clips: 17,
    render_status: "Ready for human review".to_string(),
  }
}
