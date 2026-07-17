import { describe, it, expect } from 'vitest';
import { AdapterManager } from '../src/index';
import path from 'path';
import os from 'os';

describe('AdapterManager', () => {
  const manager = new AdapterManager();

  it('should resolve global path with tilde expansion', () => {
    const config = { name: 'Test', workspacePath: '.test', format: 'json', globalPath: '~/.config/test' };
    const resolved = manager.resolveGlobalPath(config);
    expect(resolved).toBe(path.join(os.homedir(), '.config/test'));
  });

  it('should return null if no global path is specified', () => {
    const config = { name: 'Test', workspacePath: '.test', format: 'json' };
    expect(manager.resolveGlobalPath(config)).toBeNull();
  });

  it('should resolve workspace path', () => {
    const config = { name: 'Test', workspacePath: '.test', format: 'json' };
    const resolved = manager.resolveWorkspacePath(config, '/mock/workspace');
    expect(resolved).toBe(path.join('/mock/workspace', '.test'));
  });
});
