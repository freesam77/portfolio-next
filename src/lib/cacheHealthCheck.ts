import fs from 'fs/promises';
import path from 'path';

export async function getCacheStats() {
  const cacheDir = path.join(process.cwd(), 'public', 'cached-icons');
  const cacheIndexFile = path.join(cacheDir, 'cache-index.json');
  
  try {
    const [indexExists, dirStats] = await Promise.allSettled([
      fs.access(cacheIndexFile),
      fs.readdir(cacheDir)
    ]);
    
    const stats = {
      cacheExists: indexExists.status === 'fulfilled',
      cachedFiles: dirStats.status === 'fulfilled' ? 
        dirStats.value.filter(f => f.endsWith('.svg')).length : 0,
      totalFiles: dirStats.status === 'fulfilled' ? dirStats.value.length : 0,
      lastUpdated: null as Date | null
    };
    
    if (stats.cacheExists) {
      try {
        const indexData = await fs.readFile(cacheIndexFile, 'utf-8');
        const entries = JSON.parse(indexData);
        if (entries.length > 0) {
          const timestamps = entries.map(([, entry]: [string, any]) => entry.timestamp);
          stats.lastUpdated = new Date(Math.max(...timestamps));
        }
      } catch (error) {
        console.warn('Error reading cache index:', error);
      }
    }
    
    return stats;
  } catch (error) {
    console.error('Error getting cache stats:', error);
    return {
      cacheExists: false,
      cachedFiles: 0,
      totalFiles: 0,
      lastUpdated: null
    };
  }
}