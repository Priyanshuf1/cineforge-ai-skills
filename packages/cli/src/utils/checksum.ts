import * as crypto from 'crypto';
import * as fs from 'fs-extra';
import * as path from 'path';

/**
 * Computes a deterministic SHA-256 hash of a directory's contents.
 * Normalizes paths, ignores symlinks that escape, and deterministically sorts.
 */
export async function computeDirectoryChecksum(dirPath: string): Promise<string> {
  const hash = crypto.createHash('sha256');
  
  if (!(await fs.pathExists(dirPath))) {
    throw new Error(`Directory does not exist: ${dirPath}`);
  }

  const stat = await fs.stat(dirPath);
  if (!stat.isDirectory()) {
    throw new Error(`Path is not a directory: ${dirPath}`);
  }

  const allFiles = await walk(dirPath, dirPath);
  
  // Deterministic sorting
  allFiles.sort((a, b) => a.relativePath.localeCompare(b.relativePath));

  for (const file of allFiles) {
    // Hash the normalized path
    hash.update(`path:${file.relativePath}\n`);
    
    // Hash the contents
    const content = await fs.readFile(file.fullPath);
    hash.update(`content:`).update(content).update('\n');
  }

  return hash.digest('hex');
}

async function walk(currentDir: string, rootDir: string): Promise<{ relativePath: string; fullPath: string }[]> {
  let results: { relativePath: string; fullPath: string }[] = [];
  
  const entries = await fs.readdir(currentDir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(currentDir, entry.name);
    
    if (entry.isDirectory()) {
      results = results.concat(await walk(fullPath, rootDir));
    } else if (entry.isFile()) {
      // Normalize to POSIX paths (using '/') for consistent hashing across platforms
      const relativePath = path.relative(rootDir, fullPath).split(path.sep).join('/');
      results.push({ relativePath, fullPath });
    }
    // Note: Ignoring symlinks entirely to prevent escaping the directory
  }
  
  return results;
}
