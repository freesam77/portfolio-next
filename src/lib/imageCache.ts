'use server';

import fs from 'fs/promises';
import path from 'path';

interface CacheEntry {
  url: string;
  localPath: string;
  timestamp: number;
}

const CACHE_DIR = path.join(process.cwd(), 'public', 'cached-icons');
const CACHE_INDEX_FILE = path.join(CACHE_DIR, 'cache-index.json');
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

async function ensureCacheDir() {
  try {
    await fs.access(CACHE_DIR);
  } catch {
    await fs.mkdir(CACHE_DIR, { recursive: true });
  }
}

async function loadCacheIndex(): Promise<Map<string, CacheEntry>> {
  try {
    const data = await fs.readFile(CACHE_INDEX_FILE, 'utf-8');
    const entries = JSON.parse(data);
    return new Map(entries);
  } catch {
    return new Map();
  }
}

async function saveCacheIndex(cache: Map<string, CacheEntry>) {
  await ensureCacheDir();
  const entries = Array.from(cache.entries());
  await fs.writeFile(CACHE_INDEX_FILE, JSON.stringify(entries, null, 2));
}

export async function cacheImage(url: string): Promise<string> {
  if (!url || !url.includes('svgrepo.com')) {
    return url; // Return original URL for non-svgrepo images
  }

  await ensureCacheDir();
  const cache = await loadCacheIndex();
  
  // Check if image is already cached and fresh
  const existing = cache.get(url);
  if (existing && Date.now() - existing.timestamp < CACHE_TTL) {
    try {
      await fs.access(path.join(process.cwd(), 'public', existing.localPath));
      return existing.localPath;
    } catch {
      // File doesn't exist, remove from cache
      cache.delete(url);
    }
  }

  try {
    // Extract filename from URL
    const urlObj = new URL(url);
    const fileName = path.basename(urlObj.pathname) || 'icon.svg';
    const localPath = `/cached-icons/${Date.now()}-${fileName}`;
    const fullPath = path.join(process.cwd(), 'public', localPath);

    // Download with retry logic and rate limiting
    let response;
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount < maxRetries) {
      try {
        // Add delay to avoid rate limiting
        if (retryCount > 0) {
          await new Promise(resolve => setTimeout(resolve, (retryCount * 2000) + Math.random() * 1000));
        }
        
        response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; Portfolio-Cache/1.0)',
            'Accept': 'image/svg+xml,image/*,*/*;q=0.8',
          },
        });
        
        if (response.ok) break;
        if (response.status === 429) {
          retryCount++;
          continue;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      } catch (error) {
        retryCount++;
        if (retryCount >= maxRetries) {
          console.warn(`Failed to cache image ${url}:`, error);
          return url; // Return original URL as fallback
        }
      }
    }

    if (!response || !response.ok) {
      return url; // Return original URL as fallback
    }

    const buffer = await response.arrayBuffer();
    await fs.writeFile(fullPath, new Uint8Array(buffer));

    // Update cache
    cache.set(url, {
      url,
      localPath,
      timestamp: Date.now(),
    });
    
    await saveCacheIndex(cache);
    return localPath;
  } catch (error) {
    console.warn(`Failed to cache image ${url}:`, error);
    return url; // Return original URL as fallback
  }
}

export async function preloadSkillsetIcons(skillsetData: any[]) {
  if (!Array.isArray(skillsetData)) return skillsetData;

  const processedData = await Promise.all(
    skillsetData.map(async (item) => {
      if (item.src && typeof item.src === 'string') {
        const cachedSrc = await cacheImage(item.src);
        return { ...item, src: cachedSrc };
      }
      return item;
    })
  );

  return processedData;
}