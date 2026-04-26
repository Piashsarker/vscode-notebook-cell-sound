# Changelog

All notable changes to the **Notebook Cell Sound** extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-04-26

### Added
- 🔔 Automatic sound notification when notebook cells complete execution
- 🎵 Custom sound file support (WAV, MP3, OGG, AIFF, M4A)
- ✅ Separate sounds for successful execution and errors
- 🔊 Volume control (0% to 100%)
- 🎛️ Toggle command to quickly enable/disable sounds
- 💻 Cross-platform support (macOS, Windows, Linux)
- 📋 Debug logging for troubleshooting

### Commands
- `Cell Sound: Toggle Sound On/Off` - Enable or disable sounds
- `Cell Sound: Select Custom Sound File` - Choose custom success sound
- `Cell Sound: Select Custom Error Sound File` - Choose custom error sound
- `Cell Sound: Test Current Sound` - Test the current sound configuration
- `Cell Sound: Show Debug Logs` - View extension logs

### Settings
- `cellCompletionSound.enabled` - Enable/disable the extension
- `cellCompletionSound.soundFilePath` - Custom success sound path
- `cellCompletionSound.errorSoundFilePath` - Custom error sound path
- `cellCompletionSound.volume` - Volume level (0.0 to 1.0)
- `cellCompletionSound.playOnSuccess` - Play sound on success
- `cellCompletionSound.playOnError` - Play sound on error

---

## [Unreleased]

### Planned
- Sound presets (different built-in sounds to choose from)
- Per-notebook sound settings
- Minimum execution time threshold (only play for cells that take longer than X seconds)
