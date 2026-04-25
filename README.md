# Cell Completion Sound for Kiro IDE

A Kiro/VS Code extension that plays a customizable sound when a Python notebook cell finishes execution. Perfect for long-running cells where you want to be notified when they complete!

## Features

- 🔔 **Automatic Sound Notification**: Plays a sound when any notebook cell completes execution
- 🎵 **Customizable Sounds**: Use your own sound files (WAV, MP3, OGG, AIFF, M4A)
- ✅ **Success/Error Differentiation**: Different sounds for successful execution vs errors
- 🔊 **Volume Control**: Adjust the volume from 0 to 100%
- 🎛️ **Easy Toggle**: Quickly enable/disable sounds via command palette
- 💻 **Cross-Platform**: Works on macOS, Windows, and Linux

## Installation

### From Source

1. Clone or download this extension folder
2. Open a terminal in the extension directory
3. Run:
   ```bash
   npm install
   npm run compile
   ```
4. Copy the entire folder to your Kiro extensions directory:
   - **macOS/Linux**: `~/.kiro/extensions/`
   - **Windows**: `%USERPROFILE%\.kiro\extensions\`
5. Restart Kiro IDE

### Development Mode

1. Open the extension folder in Kiro/VS Code
2. Press `F5` to launch the Extension Development Host
3. Open a Jupyter notebook and run a cell to test

## Usage

### Basic Usage

Once installed, the extension automatically plays a sound when any notebook cell finishes executing. No configuration needed!

### Commands

Open the Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`) and search for:

| Command | Description |
|---------|-------------|
| `Cell Sound: Toggle Sound On/Off` | Enable or disable the completion sound |
| `Cell Sound: Select Custom Sound File` | Choose a custom sound file for successful completions |
| `Cell Sound: Select Custom Error Sound File` | Choose a custom sound file for errors |
| `Cell Sound: Test Current Sound` | Play the current sound to test it |

### Settings

Configure the extension in Settings (`Cmd+,` / `Ctrl+,`):

| Setting | Default | Description |
|---------|---------|-------------|
| `cellCompletionSound.enabled` | `true` | Enable or disable the completion sound |
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
4. The extension will use this sound for all future completions

### Supported Formats

- WAV (recommended for best compatibility)
- MP3
- OGG
- AIFF
- M4A

### Finding Free Sounds

Here are some resources for free notification sounds:

- [Freesound.org](https://freesound.org/)
- [Mixkit](https://mixkit.co/free-sound-effects/)
- [Zapsplat](https://www.zapsplat.com/)

## Platform Notes

### macOS
Uses `afplay` (built-in). Full volume control supported.

### Windows
Uses PowerShell's `Media.SoundPlayer`. WAV files work best.

### Linux
Tries multiple players in order:
1. `paplay` (PulseAudio)
2. `aplay` (ALSA)
3. `ffplay` (FFmpeg)

Install at least one of these for sound playback.

## Troubleshooting

### No sound plays
1. Check that the extension is enabled in settings
2. Run `Cell Sound: Test Current Sound` to verify audio works
3. On Linux, ensure you have `paplay`, `aplay`, or `ffplay` installed
4. Check your system volume

### Custom sound doesn't work
1. Verify the file path is correct
2. Try a WAV file (most compatible format)
3. Check file permissions

### Sound plays for non-Python cells
The extension triggers for all notebook cell executions. This is by design to support various notebook types.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

MIT License - feel free to use and modify as needed.
