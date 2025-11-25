#!/usr/bin/env node

/**
 * Pre-cache script for SVG icons
 * Run this during build to cache external icons locally
 */

const fs = require('fs').promises;
const path = require('path');

async function precacheIcons() {
  console.log('🔄 Pre-caching SVG icons...');
  
  try {
    // This would be run during build time when we have access to the data
    // For now, we'll create the cache directory structure
    const cacheDir = path.join(process.cwd(), 'public', 'cached-icons');
    
    try {
      await fs.access(cacheDir);
      console.log('✅ Cache directory already exists');
    } catch {
      await fs.mkdir(cacheDir, { recursive: true });
      console.log('✅ Created cache directory');
    }
    
    // Create a .gitignore file for the cache directory
    const gitignorePath = path.join(cacheDir, '.gitignore');
    const gitignoreContent = `# Cached icons - generated at build time
*
!.gitignore
`;
    
    await fs.writeFile(gitignorePath, gitignoreContent);
    console.log('✅ Created .gitignore for cache directory');
    
  } catch (error) {
    console.error('❌ Error setting up icon cache:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  precacheIcons();
}

module.exports = precacheIcons;