import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkGfm from "remark-gfm";
import type { Root } from "hast";

const mdastProcessor = unified().use(remarkParse).use(remarkGfm);

const hastTransformer = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: false });

export function parseMarkdown(markdown: string): Root {
  const mdast = mdastProcessor.parse(markdown);
  return hastTransformer.runSync(mdast) as Root;
}
