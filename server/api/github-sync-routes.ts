import { Router, Request, Response } from 'express';
import { createGitHubSync } from '../services/github-sync';
import fs from 'fs/promises';
import path from 'path';

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
      message: message || `Update ${filePath} from Replit`,
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
      message || `Update ${files.length} files from Replit`,
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

export default router;
