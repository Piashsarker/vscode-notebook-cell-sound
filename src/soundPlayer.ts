import * as path from 'path';
import * as fs from 'fs';
import { exec } from 'child_process';

export class SoundPlayer {
    private extensionPath: string;
    private defaultSuccessSound: string;
    private defaultErrorSound: string;

    constructor(extensionPath: string) {
        this.extensionPath = extensionPath;
        this.defaultSuccessSound = path.join(extensionPath, 'sounds', 'success.wav');
        this.defaultErrorSound = path.join(extensionPath, 'sounds', 'error.wav');
    }

    async playSound(customPath: string, volume: number, isError: boolean = false): Promise<void> {
        let soundPath: string;

        if (customPath && fs.existsSync(customPath)) {
            soundPath = customPath;
        } else {
            // Use default sounds
            soundPath = isError ? this.defaultErrorSound : this.defaultSuccessSound;
            
            // If default sounds don't exist, use system beep
            if (!fs.existsSync(soundPath)) {
                return this.playSystemBeep();
            }
        }

        return this.playSoundFile(soundPath, volume);
    }

    private async playSoundFile(filePath: string, volume: number): Promise<void> {
        const platform = process.platform;

        return new Promise((resolve, reject) => {
            let command: string;

            if (platform === 'darwin') {
                // macOS - use afplay with volume
                // afplay volume is 0-255, we convert from 0-1
                const afplayVolume = Math.round(volume * 255);
                command = `afplay -v ${volume} "${filePath}"`;
            } else if (platform === 'win32') {
                // Windows - use PowerShell to play sound
                // Note: Volume control on Windows requires more complex handling
                command = `powershell -c "(New-Object Media.SoundPlayer '${filePath}').PlaySync()"`;
            } else {
                // Linux - try multiple players
                command = this.getLinuxPlayCommand(filePath, volume);
            }

            exec(command, (error) => {
                if (error) {
                    console.error('Error playing sound:', error);
                    // Fallback to system beep
                    this.playSystemBeep().then(resolve).catch(reject);
                } else {
                    resolve();
                }
            });
        });
    }

    private getLinuxPlayCommand(filePath: string, volume: number): string {
        // Try paplay (PulseAudio) first, then aplay (ALSA), then ffplay
        const volumePercent = Math.round(volume * 100);
        return `paplay --volume=${Math.round(volume * 65536)} "${filePath}" 2>/dev/null || ` +
               `aplay "${filePath}" 2>/dev/null || ` +
               `ffplay -nodisp -autoexit -volume ${volumePercent} "${filePath}" 2>/dev/null`;
    }

    private async playSystemBeep(): Promise<void> {
        const platform = process.platform;

        return new Promise((resolve) => {
            let command: string;

            if (platform === 'darwin') {
                command = 'afplay /System/Library/Sounds/Glass.aiff';
            } else if (platform === 'win32') {
                command = 'powershell -c "[console]::beep(800,200)"';
            } else {
                command = 'echo -e "\\a"';
            }

            exec(command, () => {
                resolve();
            });
        });
    }
}
