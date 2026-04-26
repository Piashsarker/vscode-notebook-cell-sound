# Notebook Cell Sound

A VS Code / Kiro extension that plays a sound when a Jupyter notebook cell finishes execution. Perfect for long-running cells where you want audio feedback when they complete!

## Demo

https://github.com/user-attachments/assets/YOUR_VIDEO_ID_HERE

> **Note:** Replace the video URL above with your actual demo video. To add a video:
> 1. Go to your GitHub repo → Issues → New Issue
> 2. Drag and drop your video file into the comment box
> 3. GitHub will generate a URL like `https://github.com/user-attachments/assets/...`
> 4. Copy that URL and replace the placeholder above

## Features

- 🔔 **Automatic Sound Notification** — Plays a sound when any notebook cell completes
- 🎵 **Customizable Sounds** — Use your own sound files (WAV, MP3, OGG, AIFF, M4A)
- ✅ **Success/Error Sounds** — Different sounds for successful execution vs errors
- 🔊 **Volume Control** — Adjust volume from 0% to 100%
- 🎛️ **Easy Toggle** — Quickly enable/disable via command palette
- 💻 **Cross-Platform** — Works on macOS, Windows, and Linux

![Cell Sound Demo](images/demo.gif)

## Installation

### From VS Code Marketplace

1. Open VS Code / Kiro
2. Go to Extensions (`Cmd+Shift+X` / `Ctrl+Shift+X`)
3. Search for **"Notebook Cell Sound"**
4. Click **Install**

### From VSIX File

1. Download the `.vsix` file from [Releases](https://github.com/piashsarker/cell-completion-sound/releases)
2. Open Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`)
3. Run **"Extensions: Install from VSIX..."**
4. Select the downloaded file

## Usage

Once installed, the extension automatically plays a sound when any notebook cell finishes executing. No configuration needed!

### Commands

Open the Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`) and search for:

| Command | Description |
|---------|-------------|
| `Cell Sound: Toggle Sound On/Off` | Enable or disable the completion sound |
| `Cell Sound: Select Custom Sound File` | Choose a custom sound for successful completions |
| `Cell Sound: Select Custom Error Sound File` | Choose a custom sound for errors |
| `Cell Sound: Test Current Sound` | Play the current sound to test it |
| `Cell Sound: Show Debug Logs` | View extension logs for troubleshooting |

### Settings

Configure in Settings (`Cmd+,` / `Ctrl+,`) → search "Cell Sound":

| Setting | Default | Description |
|---------|---------|-------------|
| `cellCompletionSound.enabled` | `true` | Enable/disable the completion sound |
| `cellCompletionSound.soundFilePath` | `""` | Path to custom success sound file |
| `cellCompletionSound.errorSoundFilePath` | `""` | Path to custom error sound file |
| `cellCompletionSound.volume` | `0.5` | Volume level (0.0 to 1.0) |
| `cellCompletionSound.playOnSuccess` | `true` | Play sound on successful execution |
| `cellCompletionSound.playOnError` | `true` | Play sound on failed execution |

## Custom Sounds

### Using Your Own Sounds

1. Open Command Palette
2. Run `Cell Sound: Select Custom Sound File`
3. Browse to your sound file
4. Done! The extension will use this sound going forward

### Supported Formats

- WAV (recommended)
- MP3
- OGG
- AIFF
- M4A

### Free Sound Resources

- [Freesound.org](https://freesound.org/)
- [Mixkit](https://mixkit.co/free-sound-effects/)
- [Zapsplat](https://www.zapsplat.com/)

## Platform Notes

| Platform | Audio Player | Notes |
|----------|--------------|-------|
| **macOS** | `afplay` (built-in) | Full volume control |
| **Windows** | PowerShell `Media.SoundPlayer` | WAV files work best |
| **Linux** | `paplay`, `aplay`, or `ffplay` | Install at least one |

## Troubleshooting

**No sound plays?**
1. Run `Cell Sound: Test Current Sound` to verify audio works
2. Check that the extension is enabled in settings
3. On Linux, ensure `paplay`, `aplay`, or `ffplay` is installed
4. Check your system volume

**Custom sound doesn't work?**
1. Verify the file path is correct
2. Try a WAV file (most compatible)
3. Check file permissions

## Contributing

Contributions welcome! Please open an issue or submit a pull request.

## License

[MIT License](LICENSE)

---

**Enjoy coding with audio feedback! 🔔**
