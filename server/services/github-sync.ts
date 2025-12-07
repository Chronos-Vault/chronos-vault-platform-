import { Octokit } from '@octokit/rest';

interface GitHubSyncConfig {
  owner: string;
  repo: string;
  token: string;
}

interface FileUpdate {
  path: string;
  content: string;
  message?: string;
}

export class GitHubSyncService {
  private octokit: Octokit;
  private owner: string;
  private repo: string;

  constructor(config: GitHubSyncConfig) {
    this.octokit = new Octokit({
      auth: config.token,
    });
    this.owner = config.owner;
    this.repo = config.repo;
  }

  async updateFile(update: FileUpdate): Promise<void> {
    try {
      let sha: string | undefined;
      
      try {
        const { data: existingFile } = await this.octokit.repos.getContent({
          owner: this.owner,
          repo: this.repo,
          path: update.path,
        });

        if ('sha' in existingFile) {
          sha = existingFile.sha;
        }
      } catch (error: any) {
        if (error.status !== 404) {
          throw error;
        }
      }

      const contentBase64 = Buffer.from(update.content).toString('base64');

      await this.octokit.repos.createOrUpdateFileContents({
        owner: this.owner,
        repo: this.repo,
        path: update.path,
        message: update.message || `Update ${update.path}`,
        content: contentBase64,
        sha,
      });

      console.log(`✅ Successfully synced ${update.path} to GitHub`);
    } catch (error: any) {
      console.error(`❌ Failed to sync ${update.path}:`, error.message);
      throw error;
    }
  }

  async updateMultipleFiles(updates: FileUpdate[]): Promise<void> {
    const results = await Promise.allSettled(
      updates.map(update => this.updateFile(update))
    );

    const failed = results.filter(r => r.status === 'rejected');
    if (failed.length > 0) {
      console.error(`⚠️  ${failed.length}/${updates.length} files failed to sync`);
    } else {
      console.log(`✅ Successfully synced ${updates.length} files to GitHub`);
    }
  }

  async createBranch(branchName: string, fromBranch: string = 'main'): Promise<void> {
    const { data: ref } = await this.octokit.git.getRef({
      owner: this.owner,
      repo: this.repo,
      ref: `heads/${fromBranch}`,
    });

    await this.octokit.git.createRef({
      owner: this.owner,
      repo: this.repo,
      ref: `refs/heads/${branchName}`,
      sha: ref.object.sha,
    });

    console.log(`✅ Created branch ${branchName}`);
  }

  async commitMultipleFiles(
    files: FileUpdate[],
    commitMessage: string,
    branch: string = 'main'
  ): Promise<void> {
    const { data: ref } = await this.octokit.git.getRef({
      owner: this.owner,
      repo: this.repo,
      ref: `heads/${branch}`,
    });

    const { data: commit } = await this.octokit.git.getCommit({
      owner: this.owner,
      repo: this.repo,
      commit_sha: ref.object.sha,
    });

    const { data: tree } = await this.octokit.git.createTree({
      owner: this.owner,
      repo: this.repo,
      base_tree: commit.tree.sha,
      tree: files.map(file => ({
        path: file.path,
        mode: '100644' as const,
        type: 'blob' as const,
        content: file.content,
      })),
    });

    const { data: newCommit } = await this.octokit.git.createCommit({
      owner: this.owner,
      repo: this.repo,
      message: commitMessage,
      tree: tree.sha,
      parents: [ref.object.sha],
    });

    await this.octokit.git.updateRef({
      owner: this.owner,
      repo: this.repo,
      ref: `heads/${branch}`,
      sha: newCommit.sha,
    });

    console.log(`✅ Committed ${files.length} files: ${commitMessage}`);
  }

  async getRepoInfo() {
    const { data } = await this.octokit.repos.get({
      owner: this.owner,
      repo: this.repo,
    });
    return data;
  }
}

export function createGitHubSync(targetRepo?: string): GitHubSyncService | null {
  const token = process.env.GITHUB_TOKEN;
  
  if (!token) {
    console.warn('⚠️  GITHUB_TOKEN not found - GitHub sync disabled');
    return null;
  }

  return new GitHubSyncService({
    owner: 'Chronos-Vault',
    repo: targetRepo || 'chronos-vault-platform-',
    token,
  });
}
