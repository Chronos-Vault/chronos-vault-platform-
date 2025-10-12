import { GitHubSyncService } from './github-sync';
import fs from 'fs/promises';
import path from 'path';

interface RepoConfig {
  name: string;
  description: string;
  paths: string[];
  files: string[];
}

const REPO_MAPPING: Record<string, RepoConfig> = {
  'chronos-vault-platform-': {
    name: 'chronos-vault-platform-',
    description: 'Main platform code',
    paths: [
      'client/',
      'server/',
      'shared/',
      'public/',
      'vite.config.ts',
      'tsconfig.json',
      'tailwind.config.ts',
      'postcss.config.js',
      'components.json',
      'drizzle.config.ts',
    ],
    files: [
      'package.json',
      'package-lock.json',
      '.gitignore',
      '.env.example',
    ],
  },
  'chronos-vault-contracts': {
    name: 'chronos-vault-contracts',
    description: 'Smart contracts',
    paths: [
      'contracts/',
      'solana-program/',
      'ton-blueprint-deploy/',
      'ton-deployment/',
      'deployments/',
      'scripts/',
      'temp_contracts/',
    ],
    files: [
      'hardhat.config.cjs',
      'tsconfig.hardhat.json',
      'deployment-arbitrum.json',
      'contracts-package.json',
      'contracts-README.md',
      'contracts-gitignore',
      'ARBITRUM_DEPLOYMENT.md',
      'SOLANA_DEPLOYMENT.md',
      'DEPLOYMENT_SUMMARY_V3.md',
    ],
  },
  'chronos-vault-sdk': {
    name: 'chronos-vault-sdk',
    description: 'TypeScript SDK',
    paths: [
      'sdk/',
    ],
    files: [
      'sdk-package.json',
      'sdk-tsconfig.json',
      'sdk-README.md',
      'sdk-gitignore',
      'SDK_USAGE.md',
    ],
  },
  'chronos-vault-docs': {
    name: 'chronos-vault-docs',
    description: 'Developer documentation',
    paths: [
      'docs/',
    ],
    files: [
      'README.md',
      'API_REFERENCE.md',
      'INTEGRATION_EXAMPLES.md',
      'TECHNICAL_README.md',
      'wallet-integration-api.md',
    ],
  },
  'chronos-vault-security': {
    name: 'chronos-vault-security',
    description: 'Security audits & research',
    paths: [
      'formal-proofs/',
      'certora/',
      'tlaplus/',
      'security/',
    ],
    files: [
      'SECURITY_ARCHITECTURE.md',
      'SECURITY_ROADMAP.md',
      'FORMAL_VERIFICATION_SUMMARY.md',
      'MATHEMATICAL_DEFENSE_LAYER.md',
      'security-README.md',
      'security-gitignore',
    ],
  },
};

export class MultiRepoGitHubSync {
  private services: Map<string, GitHubSyncService>;
  private token: string;

  constructor(token: string) {
    this.token = token;
    this.services = new Map();

    for (const repoName of Object.keys(REPO_MAPPING)) {
      this.services.set(
        repoName,
        new GitHubSyncService({
          owner: 'Chronos-Vault',
          repo: repoName,
          token,
        })
      );
    }
  }

  private determineRepo(filePath: string): string | null {
    for (const [repoName, config] of Object.entries(REPO_MAPPING)) {
      if (config.files.includes(filePath)) {
        return repoName;
      }

      for (const pathPrefix of config.paths) {
        if (filePath.startsWith(pathPrefix)) {
          return repoName;
        }
      }
    }

    return null;
  }

  async syncFile(filePath: string, message?: string): Promise<void> {
    const repoName = this.determineRepo(filePath);
    
    if (!repoName) {
      throw new Error(`No repository mapping found for file: ${filePath}`);
    }

    const service = this.services.get(repoName);
    if (!service) {
      throw new Error(`Service not found for repo: ${repoName}`);
    }

    const content = await fs.readFile(filePath, 'utf-8');

    await service.updateFile({
      path: filePath,
      content,
      message: message || `Update ${filePath}`,
    });

    console.log(`✅ Synced ${filePath} → ${repoName}`);
  }

  async syncAllFiles(message: string = 'Update repository with latest changes'): Promise<void> {
    const filesByRepo = new Map<string, string[]>();

    for (const [repoName, config] of Object.entries(REPO_MAPPING)) {
      filesByRepo.set(repoName, []);

      for (const file of config.files) {
        try {
          await fs.access(file);
          filesByRepo.get(repoName)!.push(file);
        } catch {
        }
      }

      for (const pathPrefix of config.paths) {
        try {
          const stats = await fs.stat(pathPrefix);
          if (stats.isDirectory()) {
            const files = await this.getAllFilesInDirectory(pathPrefix);
            filesByRepo.get(repoName)!.push(...files);
          } else {
            filesByRepo.get(repoName)!.push(pathPrefix);
          }
        } catch {
        }
      }
    }

    for (const [repoName, files] of filesByRepo.entries()) {
      if (files.length === 0) {
        console.log(`⏭️  Skipping ${repoName} (no files found)`);
        continue;
      }

      const service = this.services.get(repoName);
      if (!service) continue;

      const fileContents = await Promise.all(
        files.map(async (filePath) => {
          const content = await fs.readFile(filePath, 'utf-8');
          return { path: filePath, content };
        })
      );

      await service.commitMultipleFiles(
        fileContents,
        `${message} - ${files.length} files`,
        'main'
      );

      console.log(`✅ Synced ${files.length} files to ${repoName}`);
    }
  }

  async syncDocumentation(): Promise<void> {
    const docsRepo = 'chronos-vault-docs';
    const service = this.services.get(docsRepo);
    if (!service) {
      throw new Error(`Service not found for ${docsRepo}`);
    }

    const config = REPO_MAPPING[docsRepo];
    const files: string[] = [];

    for (const file of config.files) {
      try {
        await fs.access(file);
        files.push(file);
      } catch {
      }
    }

    const docsDir = 'docs/';
    try {
      const docsFiles = await this.getAllFilesInDirectory(docsDir);
      files.push(...docsFiles);
    } catch {
    }

    const fileContents = await Promise.all(
      files.map(async (filePath) => {
        const content = await fs.readFile(filePath, 'utf-8');
        return { path: filePath, content };
      })
    );

    await service.commitMultipleFiles(
      fileContents,
      'Update developer documentation and API reference',
      'main'
    );

    console.log(`✅ Synced ${files.length} documentation files to ${docsRepo}`);
  }

  async syncPlatform(): Promise<void> {
    const platformRepo = 'chronos-vault-platform-';
    const service = this.services.get(platformRepo);
    if (!service) {
      throw new Error(`Service not found for ${platformRepo}`);
    }

    const config = REPO_MAPPING[platformRepo];
    const files: string[] = [...config.files];

    for (const pathPrefix of config.paths) {
      try {
        const stats = await fs.stat(pathPrefix);
        if (stats.isDirectory()) {
          const dirFiles = await this.getAllFilesInDirectory(pathPrefix);
          files.push(...dirFiles);
        } else {
          files.push(pathPrefix);
        }
      } catch {
      }
    }

    const fileContents = await Promise.all(
      files.map(async (filePath) => {
        const content = await fs.readFile(filePath, 'utf-8');
        return { path: filePath, content };
      })
    );

    await service.commitMultipleFiles(
      fileContents,
      'Update platform architecture and core systems',
      'main'
    );

    console.log(`✅ Synced ${files.length} platform files to ${platformRepo}`);
  }

  async syncContracts(): Promise<void> {
    const contractsRepo = 'chronos-vault-contracts';
    const service = this.services.get(contractsRepo);
    if (!service) {
      throw new Error(`Service not found for ${contractsRepo}`);
    }

    const config = REPO_MAPPING[contractsRepo];
    const files: string[] = [...config.files];

    for (const pathPrefix of config.paths) {
      try {
        const stats = await fs.stat(pathPrefix);
        if (stats.isDirectory()) {
          const dirFiles = await this.getAllFilesInDirectory(pathPrefix);
          files.push(...dirFiles);
        } else {
          files.push(pathPrefix);
        }
      } catch {
      }
    }

    const fileContents = await Promise.all(
      files.map(async (filePath) => {
        const content = await fs.readFile(filePath, 'utf-8');
        return { path: filePath, content };
      })
    );

    await service.commitMultipleFiles(
      fileContents,
      'Update multi-chain smart contracts and deployment configurations',
      'main'
    );

    console.log(`✅ Synced ${files.length} contract files to ${contractsRepo}`);
  }

  async syncSecurity(): Promise<void> {
    const securityRepo = 'chronos-vault-security';
    const service = this.services.get(securityRepo);
    if (!service) {
      throw new Error(`Service not found for ${securityRepo}`);
    }

    const config = REPO_MAPPING[securityRepo];
    const files: string[] = [...config.files];

    for (const pathPrefix of config.paths) {
      try {
        const stats = await fs.stat(pathPrefix);
        if (stats.isDirectory()) {
          const dirFiles = await this.getAllFilesInDirectory(pathPrefix);
          files.push(...dirFiles);
        } else {
          files.push(pathPrefix);
        }
      } catch {
      }
    }

    const fileContents = await Promise.all(
      files.map(async (filePath) => {
        const content = await fs.readFile(filePath, 'utf-8');
        return { path: filePath, content };
      })
    );

    await service.commitMultipleFiles(
      fileContents,
      'Update security audits and formal verification proofs',
      'main'
    );

    console.log(`✅ Synced ${files.length} security files to ${securityRepo}`);
  }

  private async getAllFilesInDirectory(dir: string): Promise<string[]> {
    const files: string[] = [];
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.name.startsWith('.') || entry.name === 'node_modules') {
        continue;
      }

      if (entry.isDirectory()) {
        const subFiles = await this.getAllFilesInDirectory(fullPath);
        files.push(...subFiles);
      } else {
        files.push(fullPath);
      }
    }

    return files;
  }

  getRepoSummary(): Record<string, string> {
    const summary: Record<string, string> = {};
    for (const [repoName, config] of Object.entries(REPO_MAPPING)) {
      summary[repoName] = config.description;
    }
    return summary;
  }
}

export function createMultiRepoGitHubSync(): MultiRepoGitHubSync | null {
  const token = process.env.GITHUB_TOKEN;
  
  if (!token) {
    console.warn('⚠️  GITHUB_TOKEN not found - GitHub sync disabled');
    return null;
  }

  return new MultiRepoGitHubSync(token);
}
