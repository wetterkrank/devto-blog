import unified from 'unified';
import parse from 'remark-parse';
import remarkHtml from 'remark-html';
import * as highlight from 'remark-highlight.js';
import gfm from 'remark-gfm';
import matter from 'gray-matter';
import stripHtmlComments from 'strip-html-comments';


const apiUrl = 'https://dev.to/api/articles'
const username = 'wetterkrank'

export const getDevToPostsList = async () => {
  type DevToPostMeta = {
    id: number,
    slug: string,
    created_at: string,
    title: string
  }
  const res = await fetch(`${apiUrl}?username=${username}`)
  const data = await res.json()
  return Object.values(data).map((item: DevToPostMeta) => (
    {
      id: item.id,
      slug: item.slug,
      date: item.created_at,
      title: item.title,
      contentHtml: ''
    }
  ))
}

export const getDevToPost = async (id: number) => {
  const res = await fetch(`${apiUrl}/${id}`)
  const article = await res.json()

  const markdown = sanitizeDevToMarkdown(article.body_markdown);
  const contentHtml = convertMarkdownToHtml(markdown);
  return contentHtml
}

const sanitizeDevToMarkdown = (markdown: string) => {
  let correctedMarkdown = '';

  // Dev.to sometimes turns "# header" into "#&nbsp;header"
  const replaceSpaceCharRegex = new RegExp(String.fromCharCode(160), "g");
  correctedMarkdown = markdown.replace(replaceSpaceCharRegex, " ");

  // Dev.to allows headers with no space after the hashtag (I don't use # on Dev.to due to the title)
  const addSpaceAfterHeaderHashtagRegex = /##(?=[a-z|A-Z])/g;
  return correctedMarkdown.replace(addSpaceAfterHeaderHashtagRegex, '$& ');
}

const convertMarkdownToHtml = (markdown: string) => {
  const { content } = matter(markdown);

  const html = unified()
      .use(parse)
      .use(gfm)
      .use(highlight)
      .use(remarkHtml)
      .processSync(stripHtmlComments(content)).contents;

  return String(html);
}
