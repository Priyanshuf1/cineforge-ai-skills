import path from 'path';
import os from 'os';

export interface AdapterConfig {
  name: string;
  globalPath?: string;
  workspacePath: string;
  format: string;
}

export class AdapterManager {
  public resolveGlobalPath(config: AdapterConfig): string | null {
    if (!config.globalPath) return null;
    if (config.globalPath.startsWith('~')) {
      return path.join(os.homedir(), config.globalPath.slice(1));
    }
    return config.globalPath;
  }

  public resolveWorkspacePath(config: AdapterConfig, cwd: string): string {
    return path.join(cwd, config.workspacePath);
  }
}
