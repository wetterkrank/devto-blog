import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeHighlight from 'rehype-highlight';
import basic from 'highlight.js/lib/languages/basic.js';
import matter from 'gray-matter';
import strip from 'strip-comments';

const baseUrl = `https://dev.to`;
const apiUrl = 'https://dev.to/api/articles';
const username = 'wetterkrank';

export const getPostsList = async () => {
  type DevToPostMeta = {
    id: number;
    slug: string;
    created_at: string;
    title: string;
  };
  const res = await fetch(`${apiUrl}?username=${username}`);
  const data: DevToPostMeta[] = await res.json();
  return Object.values(data).map((item: DevToPostMeta) => ({
    id: item.id,
    slug: item.slug,
    date: item.created_at,
    title: item.title,
    contentHtml: '',
  }));
};

const sanitizeDevToMarkdown = (markdown: string) => {
  let correctedMarkdown = '';

  // Dev.to sometimes turns "# header" into "#&nbsp;header"
  const replaceSpaceCharRegex = new RegExp(String.fromCharCode(160), 'g');
  correctedMarkdown = markdown.replace(replaceSpaceCharRegex, ' ');

  // Dev.to allows headers with no space after the hashtag
  const addSpaceAfterHeaderHashtagRegex = /##(?=[a-z|A-Z])/g;
  return correctedMarkdown.replace(addSpaceAfterHeaderHashtagRegex, '$& ');
};

const convertMarkdownToHtml = (markdown: string) => {
  const extraLanguages = { basic: basic };
  const { content } = matter(markdown);
  const html = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeStringify)
    .use(rehypeHighlight, { languages: extraLanguages })
    .processSync(strip(content));
  return String(html);
};

export const getPostContent = async (id: number) => {
  const res = await fetch(`${apiUrl}/${id}`);
  const article = await res.json();
  const markdown = sanitizeDevToMarkdown(article.body_markdown);
  const contentHtml = convertMarkdownToHtml(markdown);
  return contentHtml;
};

export const getPostUrl = (slug: string) => {
  return `${baseUrl}/${username}/${slug}`;
};
