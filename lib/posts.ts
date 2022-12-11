import fs from 'fs';
import path from 'path';

import { getPostsList, getPostContent, getPostUrl } from './devto';
import { IPostMeta, IPostData } from '../interfaces/post';
import { delay } from './utilities';

const cacheFile = '.posts-meta-cache.json';

export async function getSortedPostsData() {
  const allPostsData: IPostMeta[] = await getPostsList();
  // Save posts metadata to cache file
  fs.writeFileSync(path.join(process.cwd(), cacheFile), JSON.stringify(allPostsData));
  return allPostsData.sort((a, b) => {
    return a.date < b.date ? 1 : -1;
  });
}

export async function getAllPostIds() {
  const allPostsData = await getSortedPostsData();
  return allPostsData.map((item) => {
    return {
      params: {
        slug: item.slug,
      },
    };
  });
}

export async function getPostData(slug: string): Promise<IPostData> {
  // Read cache, parse to object and find the post metadata by slug
  const cacheContents = fs.readFileSync(path.join(process.cwd(), cacheFile), 'utf-8');
  const cache: IPostMeta[] = JSON.parse(cacheContents);
  const meta = cache.find((cachedData: IPostMeta) => cachedData.slug === slug) as IPostMeta;

  // Query post content by id
  await delay(1000);
  const contentHtml = await getPostContent(meta.id);
  const originalUrl = getPostUrl(meta.slug);

  return {
    id: meta.id,
    slug: meta.slug,
    date: meta.date,
    title: meta.title,
    contentHtml: contentHtml,
    originalUrl: originalUrl,
  };
}
