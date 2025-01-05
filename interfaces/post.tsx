export interface IPostMeta {
  id: number;
  slug: string;
  date: string;
  title: string;
  tagList: string[];
}

export interface IPostData {
  id: number;
  slug: string;
  date: string;
  title: string;
  tagList: string[];
  contentHtml: string;
  originalUrl: string;
}
