import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface RichTextProps {
  content?: string;
  theme?: 'light' | 'dark';
}

export default function RichText({ content, theme = 'light' }: RichTextProps) {
  if (!content) return null;

  return (
    <section className={`py-16 ${theme === 'dark' ? 'bg-slate-900 text-slate-300' : 'bg-white text-slate-700'}`}>
      <div className="container-custom max-w-4xl">
        <div className={`prose prose-lg mx-auto ${theme === 'dark' ? 'prose-invert prose-p:text-slate-300 prose-headings:text-white' : 'prose-slate prose-headings:text-slate-900'}`}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </section>
  );
}