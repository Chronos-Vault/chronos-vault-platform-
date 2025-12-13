import { Router, Request, Response } from 'express';
import { createGitHubSync, GitHubSyncService } from '../services/github-sync';
import { Octokit } from '@octokit/rest';
import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';

const EXCLUDED_FILES = [
  "replit.md",
  ".replit",
  "replit.nix",
  ".replit.nix",
  "DEVELOPMENT.md",
  ".env",
  ".env.local",
  ".env.development",
  ".env.production",
  ".env.test",
  "node_modules",
  ".git",
  "dist",
  ".cache",
  "package-lock.json",
  ".upm",
  ".config",
  ".local",
  ".breakpoints",
  ".pythonlibs",
  "generated-icon.png",
  "persisted_information.md",
];

const EXCLUDED_PATTERNS = [
  /replit/i,
  /\.replit/i,
  /DEVELOPMENT\.md$/i,
  /\.d\.ts$/,
  /node_modules/,
  /\.log$/,
  /\.env/i,
  /\.local\//,
  /\.breakpoints/,
  /\.pythonlibs/,
  /persisted_information/i,
  /secrets?\.json$/i,
  /\.secret/i,
  /dev[-_]?config/i,
  /test[-_]?secrets/i,
];

// Files to delete from GitHub (Replit references and deprecated files) - NEVER upload these
const FILES_TO_DELETE_FROM_GITHUB = [
  "replit.md",
  ".replit",
  "replit.nix",
  ".replit.nix",
  "DEVELOPMENT.md",
  "replit-deploy.md",
  ".local/state/memory/persisted_information.md",
  ".breakpoints",
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
      message: message || `[Trinity Protocol™ | Chronos Vault] Update ${filePath}`,
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
      message || `[Trinity Protocol™ | Chronos Vault] Update ${files.length} files`,
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
      '[Trinity Protocol™ | Chronos Vault] Update developer documentation',
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
            `[Trinity Protocol™ | Chronos Vault] Update ${validFiles.length} files - v3.5.23`,
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

router.post('/cleanup-replit-files', async (req: Request, res: Response) => {
  try {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      return res.status(503).json({
        success: false,
        error: 'GitHub token not configured',
      });
    }

    const octokit = new Octokit({ auth: token });
    const owner = 'Chronos-Vault';
    const repo = 'chronos-vault-platform-';
    const branch = 'main';

    const deleted: string[] = [];
    const notFound: string[] = [];
    const failed: string[] = [];

    for (const filePath of FILES_TO_DELETE_FROM_GITHUB) {
      try {
        const { data: fileData } = await octokit.repos.getContent({
          owner,
          repo,
          path: filePath,
          ref: branch,
        });

        if (!Array.isArray(fileData) && fileData.sha) {
          await octokit.repos.deleteFile({
            owner,
            repo,
            path: filePath,
            message: `[Trinity Protocol™ | Chronos Vault] Remove deprecated file: ${filePath}`,
            sha: fileData.sha,
            branch,
          });
          deleted.push(filePath);
          console.log(`🗑️ Deleted from GitHub: ${filePath}`);
        }
      } catch (error: any) {
        if (error.status === 404) {
          notFound.push(filePath);
        } else {
          failed.push(filePath);
          console.error(`Failed to delete ${filePath}:`, error.message);
        }
      }
    }

    res.json({
      success: true,
      message: `Cleanup complete: ${deleted.length} deleted, ${notFound.length} not found, ${failed.length} failed`,
      deleted,
      notFound,
      failed,
    });
  } catch (error: any) {
    console.error('GitHub cleanup error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Sync contracts to the contracts repository
router.post('/sync-contracts', async (req: Request, res: Response) => {
  try {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      return res.status(503).json({
        success: false,
        error: 'GitHub token not configured',
      });
    }

    const octokit = new Octokit({ auth: token });
    const owner = 'Chronos-Vault';
    const contractsRepo = 'chronos-vault-contracts';
    const branch = 'main';

    // Collect all contract files from contracts directory
    const contractDirs = ['contracts/ethereum', 'contracts/solana', 'contracts/ton'];
    const contractFiles: Array<{ path: string; content: string }> = [];

    for (const dir of contractDirs) {
      if (fsSync.existsSync(dir)) {
        const files = getAllFilesSync(dir, dir);
        for (const filePath of files) {
          try {
            const content = await fs.readFile(filePath, 'utf-8');
            contractFiles.push({ path: filePath, content });
          } catch (e) {
            console.error(`Failed to read ${filePath}:`, e);
          }
        }
      }
    }

    if (contractFiles.length === 0) {
      return res.json({
        success: true,
        message: 'No contract files found to sync',
        uploaded: 0,
      });
    }

    // Get current ref
    const { data: ref } = await octokit.git.getRef({
      owner,
      repo: contractsRepo,
      ref: `heads/${branch}`,
    });

    const { data: commit } = await octokit.git.getCommit({
      owner,
      repo: contractsRepo,
      commit_sha: ref.object.sha,
    });

    // Create tree with all files
    const { data: tree } = await octokit.git.createTree({
      owner,
      repo: contractsRepo,
      base_tree: commit.tree.sha,
      tree: contractFiles.map(file => ({
        path: file.path,
        mode: '100644' as const,
        type: 'blob' as const,
        content: file.content,
      })),
    });

    // Create commit
    const { data: newCommit } = await octokit.git.createCommit({
      owner,
      repo: contractsRepo,
      message: `[Trinity Protocol™ | Chronos Vault] Update ${contractFiles.length} smart contracts - v3.5.23`,
      tree: tree.sha,
      parents: [ref.object.sha],
    });

    // Update ref
    await octokit.git.updateRef({
      owner,
      repo: contractsRepo,
      ref: `heads/${branch}`,
      sha: newCommit.sha,
    });

    console.log(`✅ Synced ${contractFiles.length} contracts to ${contractsRepo}`);

    res.json({
      success: true,
      message: `Successfully synced ${contractFiles.length} contracts to GitHub`,
      uploaded: contractFiles.length,
      files: contractFiles.map(f => f.path),
    });
  } catch (error: any) {
    console.error('GitHub contracts sync error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Sync a specific contract file
router.post('/sync-contract-file', async (req: Request, res: Response) => {
  try {
    const { filePath, message } = req.body;

    if (!filePath) {
      return res.status(400).json({
        success: false,
        error: 'filePath is required',
      });
    }

    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      return res.status(503).json({
        success: false,
        error: 'GitHub token not configured',
      });
    }

    // Read the file content
    let content: string;
    try {
      content = await fs.readFile(filePath, 'utf-8');
    } catch (e) {
      return res.status(404).json({
        success: false,
        error: `File not found: ${filePath}`,
      });
    }

    const octokit = new Octokit({ auth: token });
    const owner = 'Chronos-Vault';
    const repo = 'chronos-vault-contracts';

    // Check if file exists to get SHA
    let sha: string | undefined;
    try {
      const { data: existingFile } = await octokit.repos.getContent({
        owner,
        repo,
        path: filePath,
      });

      if (!Array.isArray(existingFile) && existingFile.sha) {
        sha = existingFile.sha;
      }
    } catch (error: any) {
      if (error.status !== 404) {
        throw error;
      }
    }

    const contentBase64 = Buffer.from(content).toString('base64');

    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: filePath,
      message: message || `[Trinity Protocol™ | Chronos Vault] Update ${path.basename(filePath)}`,
      content: contentBase64,
      sha,
    });

    console.log(`✅ Synced ${filePath} to contracts repo`);

    res.json({
      success: true,
      message: `Successfully synced ${filePath} to GitHub contracts repo`,
    });
  } catch (error: any) {
    console.error('GitHub contract file sync error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
