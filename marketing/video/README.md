# TagChoose 30-second introduction

Output: `output/TagChoose-30s-1080p.mp4`, 1920x1080, H.264/AAC, exactly 30.000 seconds. English SRT/VTT captions, transcript and 1280x720 thumbnail included.

Uses the extension's existing Store screenshots 1 and 5. The newer copy explains that automatic tagging uses Chrome local AI and manual saving remains available. A visible caption discloses that the images show the existing Store interface.

Voice: six new natural performances using the previously approved TabShow/HistoryOut local Chatterbox voice. Same `mlx-community/chatterbox-multilingual-v3` model, reference and generation settings. The private reference recording is not included in this repository. Its digest and settings are recorded in `source/film-narration.json`. No voice reference was uploaded to a service. Voices are scheduled intact, with no speed or pitch manipulation.

Music: the original, sample-free TabShow upbeat ambient score, reused with the user's instruction. Mixed quietly under the narration. `source/render.py` assembles the screenshots, complete performances and music with FFmpeg. Replace its source score path when rendering on another machine.

Validation: FFmpeg decoded every frame/audio packet without error. Duration independently checked with ffprobe. Contact sheet visually inspected. YouTube reported Video published on September 11, 2026: https://www.youtube.com/watch?v=Rc8u494w-Dc. English captions and custom thumbnail were saved; initial copyright and Community Guidelines checks reported no issues. Independent local Whisper transcription confirmed all six message segments, with a few wording differences in automatic recognition.
