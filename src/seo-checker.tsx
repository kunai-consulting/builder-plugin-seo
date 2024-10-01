/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { useState, useEffect } from 'react';
import appState from "@builder.io/app-context";
import { KeywordDensity, LinksGroup, SeoCheck } from "seord";

type Results = {
  seoScore: number;
  wordCount: number;
  keywordSeoScore: number;
  keywordFrequency: number;
  messages: {
    warnings: string[];
    minorWarnings: string[];
    goodPoints: string[];
  };
  keywordDensity: number;
  subKeywordDensity: KeywordDensity[];
  totalLinks: number;
  internalLinks: LinksGroup;
  outboundLinks: LinksGroup;
  titleSEO: {
    subKeywordsWithTitle: KeywordDensity[];
    keywordWithTitle: KeywordDensity;
    wordCount: number;
  }
}

type PluginOpts = {
  setResults: (results: Results) => void,
} & SEOAnalysisProps

async function getSeoResults(pluginOpts: PluginOpts) {
  const currPage = pluginOpts.pageData.results.filter((page: any) => page.previewUrl !== undefined)[0];

  const response = await fetch(currPage.previewUrl, { method: 'GET', mode: 'cors' });
  const html = await response.text();

  const filteredHtml = html
  // Remove all <script> tags and their contents
  .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  // Remove all <style> tags and their contents
  .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

  const contentJson = {
    title: currPage.data.title,
    htmlText: filteredHtml,
    keyword: pluginOpts.keyword,
    subKeywords: pluginOpts.subKeywords,
    metaDescription: currPage.data.description,
    languageCode: 'en',
    countryCode: 'us'
  };

  const seoCheck = new SeoCheck(contentJson, currPage.previewUrl || 'https://example.com');

  const newResults = await seoCheck.analyzeSeo();
  
  pluginOpts.setResults(newResults);
}

type SEOAnalysisProps = {
  keyword: string,
  subKeywords: string[]
  pageData: any
}

type PaginatedListProps = {
  items: any[];
  itemsPerPage: number;
  renderItem: (item: any, index: number) => JSX.Element;
};

const PaginatedList = ({ items, itemsPerPage, renderItem }: PaginatedListProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const pageCount = Math.ceil(items.length / itemsPerPage);

  const handlePageClick = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

  const offset = currentPage * itemsPerPage;
  const currentPageItems = items.slice(offset, offset + itemsPerPage);

  return (
    <div>
        {pageCount > 1 && (
        <div css={{ marginTop: '1rem' }}>
          {Array.from({ length: pageCount }, (_, i) => (
            <button
              key={i}
              onClick={() => handlePageClick({ selected: i })}
              css={{
                margin: '0 0.25rem',
                padding: '0.25rem 0.5rem',
                backgroundColor: currentPage === i ? '#BFDBFE' : '#E5E7EB',
                color: currentPage === i ? '#1D4ED8' : '#374151',
                border: currentPage === i ? '1px solid #60A5FA' : '1px solid #A1A1AA',
                borderRadius: '2px',
                cursor: 'pointer',
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
      <ul css={{ display: 'flex', flexDirection: 'column', gap: '1rem', listStyle: 'none', padding: '0', fontSize: '14px', lineHeight: '1.5' }}>
        {currentPageItems.map((item, index) => renderItem(item, index + offset))}
      </ul>
    </div>
  );
};

export function SEOAnalysis(props: SEOAnalysisProps) {
  const [results, setResults] = useState<Results | undefined>();

  console.log('PREVIEW URL: ', appState.designerState?.editingContentModel?.previewUrl);

  const pluginOpts: PluginOpts = {
    setResults: (newResults: Results) => setResults(newResults),
    keyword: props.keyword,
    subKeywords: props.subKeywords,
    pageData: props.pageData
  }

  useEffect(() => {
    async function asyncResults() {
      await getSeoResults(pluginOpts);
    }

    asyncResults();
  }, []);

  const {
    messages,
    seoScore,
    keywordSeoScore,
    keywordDensity,
    subKeywordDensity,
    keywordFrequency,
    wordCount,
    totalLinks
  } = results || {};

  return (
    <div css={{ padding: '1rem', marginBottom: '2rem', background: '#27272A' }}>
      <div css={{ fontWeight: 'bold', fontSize: '20px', textDecoration: 'underline' }}>SEO Score: {Math.ceil(seoScore || 0)}</div>
      
      <section> 
        <h3 css={{ color: '#F77', marginTop: '2rem' }}>Warnings ({messages?.warnings?.length || 0})</h3>
        <PaginatedList
          items={messages?.warnings || []}
          itemsPerPage={5}
          renderItem={(warning, index) => (
            <li key={`warning-${index}`}>🔴 {warning}</li>
          )}
        />
      </section>

      <section>
        <h3 css={{ color: '#FEF9C3', marginTop: '2rem' }}>Minor Warnings ({messages?.minorWarnings?.length || 0})</h3>
        <PaginatedList
          items={messages?.minorWarnings || []}
          itemsPerPage={5}
          renderItem={(warning, index) => (
            <li key={`minor-warning-${index}`}>🟡 {warning}</li>
          )}
        />
      </section>

      <section>
        <h3 css={{ color: '#89CE9E', marginTop: '2rem' }}>Good Points ({messages?.goodPoints?.length || 0})</h3>
        <PaginatedList
          items={messages?.goodPoints || []}
          itemsPerPage={5}
          renderItem={(point, index) => (
            <li key={`good-point-${index}`}>🟢 {point}</li>
          )}
        />
      </section>

      <section>
        <h3>Scores and Metrics</h3>
        <ul>
          <li>Keyword SEO Score: {keywordSeoScore}</li>
          <li>Keyword Density: {keywordDensity}</li>
          <li>Sub Keyword Density: {subKeywordDensity?.map(({ keyword, density }) => `(${keyword} ${density})`).join(', ')}</li>
          <li>Keyword Frequency: {keywordFrequency}</li>
          <li>Word Count: {wordCount}</li>
          <li>Total Links: {totalLinks}</li>
        </ul>
      </section>
    </div>
  );
}