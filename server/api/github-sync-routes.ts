import { Router, Request, Response } from 'express';
import { createGitHubSync } from '../services/github-sync';
import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';

const EXCLUDED_FILES = [
  "replit.md",
  ".replit",
  "replit.nix",
  ".env",
  ".env.local",
  "node_modules",
  ".git",
  "dist",
  ".cache",
  "package-lock.json",
  ".upm",
  ".config",
];

const EXCLUDED_PATTERNS = [
  /replit/i,
  /\.d\.ts$/,
  /node_modules/,
  /\.log$/,
];

function shouldExclude(filePath: string): boolean {
  const fileName = path.basename(filePath);
  if (EXCLUDED_FILES.includes(fileName)) return true;
  for (const pattern of EXCLUDED_PATTERNS) {
    if (pattern.test(filePath)) return true;
  }
  return false;
}

function getAllFilesSync(dir: string, baseDir: string = ""): string[] {
  const files: string[] = [];
  try {
    const items = fsSync.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const relativePath = path.join(baseDir, item);
      
      if (shouldExclude(relativePath) || shouldExclude(item)) continue;
      
      const stat = fsSync.statSync(fullPath);
      if (stat.isDirectory()) {
        files.push(...getAllFilesSync(fullPath, relativePath));
      } else if (stat.isFile()) {
        files.push(relativePath);
      }
    }
  } catch (e) {
    console.error(`Error reading directory ${dir}:`, e);
  }
  return files;
}

const router = Router();

router.post('/sync-file', async (req: Request, res: Response) => {
  try {
    const { filePath, content, message } = req.body;

    if (!filePath || !content) {
      return res.status(400).json({
        success: false,
        error: 'filePath and content are required',
      });
    }

    const githubSync = createGitHubSync();
    if (!githubSync) {
      return res.status(503).json({
        success: false,
        error: 'GitHub sync not configured - GITHUB_TOKEN missing',
      });
    }

    await githubSync.updateFile({
      path: filePath,
      content,
      message: message || `Update ${filePath} from development`,
    });

    res.json({
      success: true,
      message: `Successfully synced ${filePath} to GitHub`,
    });
  } catch (error: any) {
    console.error('GitHub sync error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.post('/sync-multiple', async (req: Request, res: Response) => {
  try {
    const { files, message } = req.body;

    if (!files || !Array.isArray(files)) {
      return res.status(400).json({
        success: false,
        error: 'files array is required',
      });
    }

    const githubSync = createGitHubSync();
    if (!githubSync) {
      return res.status(503).json({
        success: false,
        error: 'GitHub sync not configured - GITHUB_TOKEN missing',
      });
    }

    await githubSync.commitMultipleFiles(
      files,
      message || `Update ${files.length} files from development`,
      'main'
    );

    res.json({
      success: true,
      message: `Successfully synced ${files.length} files to GitHub`,
    });
  } catch (error: any) {
    console.error('GitHub sync error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.post('/sync-documentation', async (req: Request, res: Response) => {
  try {
    const githubSync = createGitHubSync();
    if (!githubSync) {
      return res.status(503).json({
        success: false,
        error: 'GitHub sync not configured - GITHUB_TOKEN missing',
      });
    }

    const docsToSync = [
      'client/src/pages/api-documentation.tsx',
      'client/src/pages/integration-guide.tsx',
      'client/src/pages/developer-portal.tsx',
    ];

    const files = await Promise.all(
      docsToSync.map(async (filePath) => {
        const content = await fs.readFile(filePath, 'utf-8');
        return {
          path: filePath,
          content,
        };
      })
    );

    await githubSync.commitMultipleFiles(
      files,
      '📝 Update developer documentation - Remove SDK references, add REST API integration',
      'main'
    );

    res.json({
      success: true,
      message: `Successfully synced ${files.length} documentation files to GitHub`,
      files: docsToSync,
    });
  } catch (error: any) {
    console.error('GitHub sync error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.get('/repo-info', async (req: Request, res: Response) => {
  try {
    const githubSync = createGitHubSync();
    if (!githubSync) {
      return res.status(503).json({
        success: false,
        error: 'GitHub sync not configured - GITHUB_TOKEN missing',
      });
    }

    const info = await githubSync.getRepoInfo();

    res.json({
      success: true,
      repo: {
        name: info.name,
        fullName: info.full_name,
        url: info.html_url,
        defaultBranch: info.default_branch,
        description: info.description,
        stars: info.stargazers_count,
        forks: info.forks_count,
      },
    });
  } catch (error: any) {
    console.error('GitHub repo info error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.post('/sync-all', async (req: Request, res: Response) => {
  try {
    const githubSync = createGitHubSync();
    if (!githubSync) {
      return res.status(503).json({
        success: false,
        error: 'GitHub sync not configured - GITHUB_TOKEN missing',
      });
    }

    const directories = ['server', 'client', 'shared'];
    const allFiles: string[] = [];
    
    for (const dir of directories) {
      if (fsSync.existsSync(dir)) {
        const files = getAllFilesSync(dir, dir);
        allFiles.push(...files);
      }
    }

    console.log(`📁 Found ${allFiles.length} files to upload to GitHub`);

    const BATCH_SIZE = 10;
    let uploaded = 0;
    let failed = 0;
    const results: Array<{ path: string; status: string }> = [];

    for (let i = 0; i < allFiles.length; i += BATCH_SIZE) {
      const batch = allFiles.slice(i, i + BATCH_SIZE);
      
      const files = await Promise.all(
        batch.map(async (filePath) => {
          try {
            const content = await fs.readFile(filePath, 'utf-8');
            return { path: filePath, content };
          } catch (e) {
            return null;
          }
        })
      );

      const validFiles = files.filter((f): f is { path: string; content: string } => f !== null);

      if (validFiles.length > 0) {
        try {
          await githubSync.commitMultipleFiles(
            validFiles,
            `[Trinity Protocol v3.5.22] Batch ${Math.floor(i / BATCH_SIZE) + 1}: Update ${validFiles.length} files`,
            'main'
          );
          uploaded += validFiles.length;
          validFiles.forEach(f => results.push({ path: f.path, status: 'uploaded' }));
          console.log(`✅ Batch ${Math.floor(i / BATCH_SIZE) + 1}: Uploaded ${validFiles.length} files`);
        } catch (e: any) {
          failed += validFiles.length;
          validFiles.forEach(f => results.push({ path: f.path, status: 'failed' }));
          console.error(`❌ Batch failed:`, e.message);
        }
      }

      if (i + BATCH_SIZE < allFiles.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    res.json({
      success: failed === 0,
      message: `Synced ${uploaded} files, ${failed} failed`,
      uploaded,
      failed,
      totalFiles: allFiles.length,
    });
  } catch (error: any) {
    console.error('GitHub sync-all error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.get('/list-files', async (req: Request, res: Response) => {
  try {
    const directories = ['server', 'client', 'shared'];
    const allFiles: string[] = [];
    
    for (const dir of directories) {
      if (fsSync.existsSync(dir)) {
        const files = getAllFilesSync(dir, dir);
        allFiles.push(...files);
      }
    }

    res.json({
      success: true,
      count: allFiles.length,
      files: allFiles,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
