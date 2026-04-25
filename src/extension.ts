import * as vscode from 'vscode';
import { SoundPlayer } from './soundPlayer';

let soundPlayer: SoundPlayer;
let outputChannel: vscode.OutputChannel;

// Track cells by their execution count to detect completion
const cellExecutionCounts = new Map<string, number>();
const cellsInProgress = new Set<string>();

export function activate(context: vscode.ExtensionContext) {
    // Create output channel for debugging
    outputChannel = vscode.window.createOutputChannel('Cell Completion Sound');
    outputChannel.appendLine('Cell Completion Sound extension activated!');

    // Initialize sound player with extension context for default sounds
    soundPlayer = new SoundPlayer(context.extensionPath);

    // Register commands
    const toggleCommand = vscode.commands.registerCommand('cellCompletionSound.toggle', () => {
        const config = vscode.workspace.getConfiguration('cellCompletionSound');
        const currentState = config.get<boolean>('enabled', true);
        config.update('enabled', !currentState, vscode.ConfigurationTarget.Global);
        vscode.window.showInformationMessage(
            `Cell completion sound ${!currentState ? 'enabled' : 'disabled'}`
        );
    });

    const selectSoundCommand = vscode.commands.registerCommand('cellCompletionSound.selectSoundFile', async () => {
        const result = await vscode.window.showOpenDialog({
            canSelectFiles: true,
            canSelectFolders: false,
            canSelectMany: false,
            filters: {
                'Audio Files': ['wav', 'mp3', 'ogg', 'aiff', 'm4a'],
                'All Files': ['*']
            },
            title: 'Select Sound File for Cell Completion'
        });

        if (result && result[0]) {
            const config = vscode.workspace.getConfiguration('cellCompletionSound');
            await config.update('soundFilePath', result[0].fsPath, vscode.ConfigurationTarget.Global);
            vscode.window.showInformationMessage(`Sound file set to: ${result[0].fsPath}`);
        }
    });

    const selectErrorSoundCommand = vscode.commands.registerCommand('cellCompletionSound.selectErrorSoundFile', async () => {
        const result = await vscode.window.showOpenDialog({
            canSelectFiles: true,
            canSelectFolders: false,
            canSelectMany: false,
            filters: {
                'Audio Files': ['wav', 'mp3', 'ogg', 'aiff', 'm4a'],
                'All Files': ['*']
            },
            title: 'Select Sound File for Cell Errors'
        });

        if (result && result[0]) {
            const config = vscode.workspace.getConfiguration('cellCompletionSound');
            await config.update('errorSoundFilePath', result[0].fsPath, vscode.ConfigurationTarget.Global);
            vscode.window.showInformationMessage(`Error sound file set to: ${result[0].fsPath}`);
        }
    });

    const testSoundCommand = vscode.commands.registerCommand('cellCompletionSound.testSound', async () => {
        const config = vscode.workspace.getConfiguration('cellCompletionSound');
        const customPath = config.get<string>('soundFilePath', '');
        const volume = config.get<number>('volume', 0.5);
        
        outputChannel.appendLine(`Testing sound - customPath: "${customPath}", volume: ${volume}`);
        
        try {
            await soundPlayer.playSound(customPath, volume);
            vscode.window.showInformationMessage('Sound played successfully!');
            outputChannel.appendLine('Sound played successfully');
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to play sound: ${error}`);
            outputChannel.appendLine(`Failed to play sound: ${error}`);
        }
    });

    const showLogsCommand = vscode.commands.registerCommand('cellCompletionSound.showLogs', () => {
        outputChannel.show();
    });

    // Watch for notebook cell output changes to detect execution completion
    const notebookChangeHandler = vscode.workspace.onDidChangeNotebookDocument((event) => {
        handleNotebookChange(event);
    });

    context.subscriptions.push(
        toggleCommand,
        selectSoundCommand,
        selectErrorSoundCommand,
        testSoundCommand,
        showLogsCommand,
        notebookChangeHandler,
        outputChannel
    );

    outputChannel.appendLine('All handlers registered');
}

function getCellKey(notebookUri: string, cellIndex: number): string {
    return `${notebookUri}::cell${cellIndex}`;
}

function handleNotebookChange(event: vscode.NotebookDocumentChangeEvent): void {
    const config = vscode.workspace.getConfiguration('cellCompletionSound');
    const enabled = config.get<boolean>('enabled', true);

    if (!enabled) {
        return;
    }

    const notebookUri = event.notebook.uri.toString();
    
    // Log all changes for debugging
    if (event.cellChanges.length > 0) {
        outputChannel.appendLine(`\n--- Notebook change detected ---`);
        outputChannel.appendLine(`Notebook: ${event.notebook.uri.fsPath}`);
        outputChannel.appendLine(`Cell changes: ${event.cellChanges.length}`);
    }

    // Check for cell execution changes
    for (const cellChange of event.cellChanges) {
        const cell = cellChange.cell;
        const cellKey = getCellKey(notebookUri, cell.index);
        const summary = cell.executionSummary;

        outputChannel.appendLine(`Cell ${cell.index}: executionOrder=${summary?.executionOrder}, success=${summary?.success}`);
        
        if (cellChange.executionSummary) {
            outputChannel.appendLine(`  ExecutionSummary changed!`);
            
            const newExecutionOrder = summary?.executionOrder;
            const previousOrder = cellExecutionCounts.get(cellKey);
            
            outputChannel.appendLine(`  Previous order: ${previousOrder}, New order: ${newExecutionOrder}`);
            
            // If execution order changed, a cell just completed
            if (newExecutionOrder !== undefined && newExecutionOrder !== previousOrder) {
                cellExecutionCounts.set(cellKey, newExecutionOrder);
                
                // Only play sound if this isn't the first time we're seeing this cell
                if (previousOrder !== undefined || cellsInProgress.has(cellKey)) {
                    cellsInProgress.delete(cellKey);
                    outputChannel.appendLine(`  Cell execution completed! Playing sound...`);
                    onCellExecutionComplete(cell, summary?.success);
                } else {
                    outputChannel.appendLine(`  First time seeing this cell, storing execution order`);
                }
            }
        }
        
        // Track cells that have outputs being added (indicates execution in progress)
        if (cellChange.outputs) {
            outputChannel.appendLine(`  Outputs changed - marking cell as in progress`);
            cellsInProgress.add(cellKey);
        }
    }
}

function onCellExecutionComplete(cell: vscode.NotebookCell, success: boolean | undefined): void {
    const config = vscode.workspace.getConfiguration('cellCompletionSound');
    const playOnSuccess = config.get<boolean>('playOnSuccess', true);
    const playOnError = config.get<boolean>('playOnError', true);
    const volume = config.get<number>('volume', 0.5);

    const hasError = success === false || checkCellForError(cell);
    
    outputChannel.appendLine(`  hasError: ${hasError}, playOnSuccess: ${playOnSuccess}, playOnError: ${playOnError}`);

    if (hasError && playOnError) {
        const errorSoundPath = config.get<string>('errorSoundFilePath', '');
        outputChannel.appendLine(`  Playing error sound: "${errorSoundPath}"`);
        soundPlayer.playSound(errorSoundPath, volume, true).catch(err => {
            outputChannel.appendLine(`  Failed to play error sound: ${err}`);
        });
    } else if (!hasError && playOnSuccess) {
        const soundPath = config.get<string>('soundFilePath', '');
        outputChannel.appendLine(`  Playing success sound: "${soundPath}"`);
        soundPlayer.playSound(soundPath, volume, false).catch(err => {
            outputChannel.appendLine(`  Failed to play success sound: ${err}`);
        });
    }
}

function checkCellForError(cell: vscode.NotebookCell): boolean {
    // Check cell outputs for error type
    for (const output of cell.outputs) {
        for (const item of output.items) {
            if (item.mime === 'application/vnd.code.notebook.error') {
                return true;
            }
        }
    }
    
    return false;
}

export function deactivate() {
    cellExecutionCounts.clear();
    cellsInProgress.clear();
}
