import { EditableElement, PageEditorConfig } from '@/components/cms/InstagramStylePageEditor';

export interface ContentVersion {
  id: string;
  pageId: string;
  elements: EditableElement[];
  timestamp: number;
  authorId: string;
  version: number;
  description?: string;
  published: boolean;
}

export interface PageMetadata {
  pageId: string;
  lastModified: number;
  lastPublished: number | null;
  currentVersion: number;
  totalVersions: number;
  authorId: string;
  locked?: boolean;
  lockedBy?: string;
  lockedAt?: number;
}

// Content Storage Manager with version control and persistence
class ContentStorageManager {
  private readonly STORAGE_PREFIX = 'redux-cms-';
  private readonly VERSION_LIMIT = 50; // Keep only last 50 versions per page

  // Save content with versioning
  async savePageContent(
    pageId: string, 
    elements: EditableElement[], 
    authorId: string,
    description?: string,
    publish: boolean = false
  ): Promise<ContentVersion> {
    try {
      const timestamp = Date.now();
      const metadata = this.getPageMetadata(pageId);
      const newVersion = metadata.currentVersion + 1;

      const contentVersion: ContentVersion = {
        id: `${pageId}-v${newVersion}-${timestamp}`,
        pageId,
        elements: JSON.parse(JSON.stringify(elements)), // Deep clone
        timestamp,
        authorId,
        version: newVersion,
        description,
        published: publish
      };

      // Save the version
      await this.saveVersion(contentVersion);

      // Update metadata
      const updatedMetadata: PageMetadata = {
        ...metadata,
        pageId,
        lastModified: timestamp,
        lastPublished: publish ? timestamp : metadata.lastPublished,
        currentVersion: newVersion,
        totalVersions: metadata.totalVersions + 1,
        authorId
      };

      this.savePageMetadata(updatedMetadata);

      // Clean up old versions if needed
      await this.cleanupOldVersions(pageId);

      // If publishing, update the live content
      if (publish) {
        await this.publishVersion(contentVersion);
      }

      return contentVersion;
    } catch (error) {
      console.error('Failed to save page content:', error);
      throw new Error('Failed to save content');
    }
  }

  // Load the latest content for a page
  async loadPageContent(pageId: string, version?: number): Promise<EditableElement[] | null> {
    try {
      if (version) {
        return await this.loadVersionContent(pageId, version);
      }

      // Load published content first, fallback to latest
      const publishedContent = await this.loadPublishedContent(pageId);
      if (publishedContent) {
        return publishedContent;
      }

      // Load latest version if no published content
      const metadata = this.getPageMetadata(pageId);
      if (metadata.currentVersion > 0) {
        return await this.loadVersionContent(pageId, metadata.currentVersion);
      }

      return null;
    } catch (error) {
      console.error('Failed to load page content:', error);
      return null;
    }
  }

  // Load content for a specific version
  private async loadVersionContent(pageId: string, version: number): Promise<EditableElement[] | null> {
    try {
      const versions = this.getVersions(pageId);
      const targetVersion = versions.find(v => v.version === version);
      
      if (!targetVersion) {
        console.warn(`Version ${version} not found for page ${pageId}`);
        return null;
      }

      return targetVersion.elements;
    } catch (error) {
      console.error('Failed to load version content:', error);
      return null;
    }
  }

  // Load published content
  private async loadPublishedContent(pageId: string): Promise<EditableElement[] | null> {
    try {
      const key = `${this.STORAGE_PREFIX}published-${pageId}`;
      const stored = localStorage.getItem(key);
      
      if (!stored) {
        return null;
      }

      const data = JSON.parse(stored);
      return data.elements;
    } catch (error) {
      console.error('Failed to load published content:', error);
      return null;
    }
  }

  // Publish a version (make it live)
  private async publishVersion(version: ContentVersion): Promise<void> {
    try {
      const key = `${this.STORAGE_PREFIX}published-${version.pageId}`;
      const publishedData = {
        elements: version.elements,
        version: version.version,
        publishedAt: version.timestamp,
        authorId: version.authorId
      };
      
      localStorage.setItem(key, JSON.stringify(publishedData));
    } catch (error) {
      console.error('Failed to publish version:', error);
      throw error;
    }
  }

  // Get page metadata
  getPageMetadata(pageId: string): PageMetadata {
    try {
      const key = `${this.STORAGE_PREFIX}metadata-${pageId}`;
      const stored = localStorage.getItem(key);
      
      if (stored) {
        return JSON.parse(stored);
      }

      // Return default metadata if none exists
      return {
        pageId,
        lastModified: 0,
        lastPublished: null,
        currentVersion: 0,
        totalVersions: 0,
        authorId: 'unknown'
      };
    } catch (error) {
      console.error('Failed to get page metadata:', error);
      return {
        pageId,
        lastModified: 0,
        lastPublished: null,
        currentVersion: 0,
        totalVersions: 0,
        authorId: 'unknown'
      };
    }
  }

  // Save page metadata
  private savePageMetadata(metadata: PageMetadata): void {
    try {
      const key = `${this.STORAGE_PREFIX}metadata-${metadata.pageId}`;
      localStorage.setItem(key, JSON.stringify(metadata));
    } catch (error) {
      console.error('Failed to save page metadata:', error);
      throw error;
    }
  }

  // Get all versions for a page
  getVersions(pageId: string): ContentVersion[] {
    try {
      const key = `${this.STORAGE_PREFIX}versions-${pageId}`;
      const stored = localStorage.getItem(key);
      
      if (stored) {
        return JSON.parse(stored);
      }

      return [];
    } catch (error) {
      console.error('Failed to get versions:', error);
      return [];
    }
  }

  // Save a version
  private async saveVersion(version: ContentVersion): Promise<void> {
    try {
      const versions = this.getVersions(version.pageId);
      versions.push(version);

      // Sort by version number
      versions.sort((a, b) => b.version - a.version);

      const key = `${this.STORAGE_PREFIX}versions-${version.pageId}`;
      localStorage.setItem(key, JSON.stringify(versions));
    } catch (error) {
      console.error('Failed to save version:', error);
      throw error;
    }
  }

  // Clean up old versions (keep only VERSION_LIMIT versions)
  private async cleanupOldVersions(pageId: string): Promise<void> {
    try {
      const versions = this.getVersions(pageId);
      
      if (versions.length > this.VERSION_LIMIT) {
        // Keep only the latest versions
        const keptVersions = versions
          .sort((a, b) => b.version - a.version)
          .slice(0, this.VERSION_LIMIT);

        const key = `${this.STORAGE_PREFIX}versions-${pageId}`;
        localStorage.setItem(key, JSON.stringify(keptVersions));
      }
    } catch (error) {
      console.error('Failed to cleanup old versions:', error);
    }
  }

  // Get version history for a page
  getVersionHistory(pageId: string): ContentVersion[] {
    return this.getVersions(pageId).sort((a, b) => b.timestamp - a.timestamp);
  }

  // Delete a specific version
  async deleteVersion(pageId: string, version: number): Promise<boolean> {
    try {
      const versions = this.getVersions(pageId);
      const filteredVersions = versions.filter(v => v.version !== version);
      
      if (filteredVersions.length === versions.length) {
        return false; // Version not found
      }

      const key = `${this.STORAGE_PREFIX}versions-${pageId}`;
      localStorage.setItem(key, JSON.stringify(filteredVersions));
      
      return true;
    } catch (error) {
      console.error('Failed to delete version:', error);
      return false;
    }
  }

  // Revert to a previous version
  async revertToVersion(pageId: string, version: number, authorId: string): Promise<boolean> {
    try {
      const versions = this.getVersions(pageId);
      const targetVersion = versions.find(v => v.version === version);
      
      if (!targetVersion) {
        return false;
      }

      // Create a new version with the old content
      await this.savePageContent(
        pageId,
        targetVersion.elements,
        authorId,
        `Reverted to version ${version}`,
        false
      );

      return true;
    } catch (error) {
      console.error('Failed to revert to version:', error);
      return false;
    }
  }

  // Export page data
  exportPageData(pageId: string): any {
    try {
      const metadata = this.getPageMetadata(pageId);
      const versions = this.getVersions(pageId);
      const publishedContent = localStorage.getItem(`${this.STORAGE_PREFIX}published-${pageId}`);

      return {
        metadata,
        versions,
        publishedContent: publishedContent ? JSON.parse(publishedContent) : null,
        exportedAt: Date.now()
      };
    } catch (error) {
      console.error('Failed to export page data:', error);
      return null;
    }
  }

  // Import page data
  async importPageData(pageId: string, data: any, authorId: string): Promise<boolean> {
    try {
      // Import versions
      if (data.versions && Array.isArray(data.versions)) {
        const key = `${this.STORAGE_PREFIX}versions-${pageId}`;
        localStorage.setItem(key, JSON.stringify(data.versions));
      }

      // Import metadata
      if (data.metadata) {
        const metadata = { ...data.metadata, authorId };
        this.savePageMetadata(metadata);
      }

      // Import published content
      if (data.publishedContent) {
        const publishKey = `${this.STORAGE_PREFIX}published-${pageId}`;
        localStorage.setItem(publishKey, JSON.stringify(data.publishedContent));
      }

      return true;
    } catch (error) {
      console.error('Failed to import page data:', error);
      return false;
    }
  }

  // Clear all content for a page
  async clearPageContent(pageId: string): Promise<void> {
    try {
      const keys = [
        `${this.STORAGE_PREFIX}metadata-${pageId}`,
        `${this.STORAGE_PREFIX}versions-${pageId}`,
        `${this.STORAGE_PREFIX}published-${pageId}`
      ];

      keys.forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Failed to clear page content:', error);
      throw error;
    }
  }

  // Get all pages with content
  getAllPages(): string[] {
    try {
      const pages: string[] = [];
      const keys = Object.keys(localStorage);

      keys.forEach(key => {
        if (key.startsWith(`${this.STORAGE_PREFIX}metadata-`)) {
          const pageId = key.replace(`${this.STORAGE_PREFIX}metadata-`, '');
          pages.push(pageId);
        }
      });

      return pages;
    } catch (error) {
      console.error('Failed to get all pages:', error);
      return [];
    }
  }

  // Get storage statistics
  getStorageStats(): any {
    try {
      const stats = {
        totalPages: 0,
        totalVersions: 0,
        totalSize: 0,
        storageUsed: 0
      };

      const pages = this.getAllPages();
      stats.totalPages = pages.length;

      pages.forEach(pageId => {
        const versions = this.getVersions(pageId);
        stats.totalVersions += versions.length;
      });

      // Calculate approximate storage size
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.STORAGE_PREFIX)) {
          const value = localStorage.getItem(key) || '';
          stats.totalSize += key.length + value.length;
        }
      });

      // Estimate storage usage
      stats.storageUsed = Math.round((stats.totalSize / (5 * 1024 * 1024)) * 100); // Percentage of 5MB

      return stats;
    } catch (error) {
      console.error('Failed to get storage stats:', error);
      return null;
    }
  }
}

// Export singleton instance
export const contentStorage = new ContentStorageManager();

// Export types and utilities
export {
  ContentStorageManager
};