import { Octokit } from "@octokit/rest";
import fs from "fs";
import path from "path";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const OWNER = "Chronos-Vault";
const REPO = "chronos-vault-platform";
const BRANCH = "main";

const EXCLUDED_FILES = [
  "replit.md",
  ".replit",
  "replit.nix",
  "DEVELOPMENT.md",
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
  /DEVELOPMENT\.md$/i,
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

function getAllFiles(dir: string, baseDir: string = ""): string[] {
  const files: string[] = [];
  try {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const relativePath = path.join(baseDir, item);
      
      if (shouldExclude(relativePath) || shouldExclude(item)) continue;
      
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        files.push(...getAllFiles(fullPath, relativePath));
      } else if (stat.isFile()) {
        files.push(relativePath);
      }
    }
  } catch (e) {
    console.error(`Error reading directory ${dir}:`, e);
  }
  return files;
}

async function getFileSha(octokit: Octokit, filePath: string): Promise<string | null> {
  try {
    const response = await octokit.repos.getContent({
      owner: OWNER,
      repo: REPO,
      path: filePath,
      ref: BRANCH,
    });
    if (!Array.isArray(response.data) && response.data.sha) {
      return response.data.sha;
    }
  } catch (e: any) {
    if (e.status !== 404) {
      console.error(`Error getting SHA for ${filePath}:`, e.message);
    }
  }
  return null;
}

async function uploadFile(
  octokit: Octokit,
  localPath: string,
  repoPath: string,
  message: string
): Promise<{ success: boolean; path: string; action: string }> {
  try {
    const content = fs.readFileSync(localPath);
    const base64Content = content.toString("base64");
    
    const existingSha = await getFileSha(octokit, repoPath);
    
    await octokit.repos.createOrUpdateFileContents({
      owner: OWNER,
      repo: REPO,
      path: repoPath,
      message,
      content: base64Content,
      branch: BRANCH,
      ...(existingSha && { sha: existingSha }),
    });
    
    return {
      success: true,
      path: repoPath,
      action: existingSha ? "updated" : "created",
    };
  } catch (e: any) {
    console.error(`Failed to upload ${repoPath}:`, e.message);
    return { success: false, path: repoPath, action: "failed" };
  }
}

export async function uploadToGitHub(directories: string[] = ["server", "client", "shared"]): Promise<{
  success: boolean;
  uploaded: number;
  failed: number;
  results: Array<{ path: string; action: string; success: boolean }>;
}> {
  if (!GITHUB_TOKEN) {
    throw new Error("GITHUB_TOKEN not configured");
  }

  const octokit = new Octokit({ auth: GITHUB_TOKEN });
  
  try {
    await octokit.repos.get({ owner: OWNER, repo: REPO });
    console.log(`✅ Connected to ${OWNER}/${REPO}`);
  } catch (e: any) {
    throw new Error(`Cannot access repository: ${e.message}`);
  }

  const allFiles: string[] = [];
  for (const dir of directories) {
    if (fs.existsSync(dir)) {
      const files = getAllFiles(dir, dir);
      allFiles.push(...files);
    }
  }

  console.log(`📁 Found ${allFiles.length} files to upload`);

  const results: Array<{ path: string; action: string; success: boolean }> = [];
  let uploaded = 0;
  let failed = 0;

  const BATCH_SIZE = 5;
  for (let i = 0; i < allFiles.length; i += BATCH_SIZE) {
    const batch = allFiles.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.all(
      batch.map(async (file) => {
        const localPath = file;
        const repoPath = file;
        const message = `[Chronos Vault Team] Update ${file}`;
        return uploadFile(octokit, localPath, repoPath, message);
      })
    );
    
    for (const result of batchResults) {
      results.push(result);
      if (result.success) {
        uploaded++;
        console.log(`✅ ${result.action}: ${result.path}`);
      } else {
        failed++;
        console.log(`❌ failed: ${result.path}`);
      }
    }
    
    if (i + BATCH_SIZE < allFiles.length) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  console.log(`\n📊 Upload complete: ${uploaded} uploaded, ${failed} failed`);

  return { success: failed === 0, uploaded, failed, results };
}

export async function uploadSpecificFiles(files: string[]): Promise<{
  success: boolean;
  uploaded: number;
  failed: number;
  results: Array<{ path: string; action: string; success: boolean }>;
}> {
  if (!GITHUB_TOKEN) {
    throw new Error("GITHUB_TOKEN not configured");
  }

  const octokit = new Octokit({ auth: GITHUB_TOKEN });
  
  const results: Array<{ path: string; action: string; success: boolean }> = [];
  let uploaded = 0;
  let failed = 0;

  for (const file of files) {
    if (!fs.existsSync(file)) {
      results.push({ path: file, action: "not found", success: false });
      failed++;
      continue;
    }
    
    const message = `[Chronos Vault Team] Update ${file}`;
    const result = await uploadFile(octokit, file, file, message);
    results.push(result);
    
    if (result.success) {
      uploaded++;
    } else {
      failed++;
    }
    
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  return { success: failed === 0, uploaded, failed, results };
}

export async function deleteFilesFromGitHub(filePaths: string[]): Promise<{
  success: boolean;
  deleted: number;
  failed: number;
  results: Array<{ path: string; action: string; success: boolean }>;
}> {
  if (!GITHUB_TOKEN) {
    throw new Error("GITHUB_TOKEN not configured");
  }

  const octokit = new Octokit({ auth: GITHUB_TOKEN });
  
  const results: Array<{ path: string; action: string; success: boolean }> = [];
  let deleted = 0;
  let failed = 0;

  for (const filePath of filePaths) {
    try {
      const sha = await getFileSha(octokit, filePath);
      if (!sha) {
        results.push({ path: filePath, action: "not found", success: true });
        continue;
      }

      await octokit.repos.deleteFile({
        owner: OWNER,
        repo: REPO,
        path: filePath,
        message: `[Chronos Vault Team] Remove deprecated file: ${filePath}`,
        sha,
        branch: BRANCH,
      });

      results.push({ path: filePath, action: "deleted", success: true });
      deleted++;
      console.log(`🗑️ Deleted: ${filePath}`);
    } catch (e: any) {
      console.error(`Failed to delete ${filePath}:`, e.message);
      results.push({ path: filePath, action: "failed", success: false });
      failed++;
    }
    
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  console.log(`\n🗑️ Delete complete: ${deleted} deleted, ${failed} failed`);
  return { success: failed === 0, deleted, failed, results };
}

export const POLYGON_DEPRECATED_FILES = [
  "server/blockchain/polygon-service.ts",
  "server/blockchain/polygon-connector.ts",
  "contracts/polygon/",
  "docs/POLYGON_DEPLOYMENT.md",
];
