import fs from 'fs';
import path from 'path';

import { getDevToPostsList, getDevToPost } from './devto'
import PostData from '../interfaces/postdata'

const cacheFile = '.posts-meta-cache.json';

export async function getSortedPostsData() {
  const allPostsData: PostData[] = await getDevToPostsList()
  // Save posts metadata to cache file
  fs.writeFileSync(path.join(process.cwd(), cacheFile), JSON.stringify(allPostsData));
  return allPostsData.sort((a, b) => {
    return (a.date < b.date) ? 1 : -1
  })
}

export async function getAllPostIds() {
  const allPostsData = await getSortedPostsData()
  return allPostsData.map(item => {
    return {
      params: {
        slug: item.slug
      }
    }
  })
}

export async function getPostData(slug: string) {
  // Read cache, parse to object and find the post metadata by slug
  const cacheContents = fs.readFileSync(path.join(process.cwd(), cacheFile), 'utf-8');
  const cache: PostData[] = JSON.parse(cacheContents);
  const meta = cache.find((cachedData: PostData) => cachedData.slug === slug) as PostData;

  // Query post content by id
  const contentHtml = await getDevToPost(meta.id)

  return {
    id: meta.id,
    slug: meta.slug,
    date: meta.date,
    title: meta.title,
    contentHtml: contentHtml
  }
}
