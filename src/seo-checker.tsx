import React from 'react';
import { useState, useEffect } from 'react';
import appState from "@builder.io/app-context";
import { KeywordDensity, LinksGroup, SeoCheck } from "seord";
import './styles.css';

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
    <div style={{ padding: '1rem' }}>
      <h2>SEO Analysis Results</h2>
      
      <section>
        <h3>Warnings ({messages?.warnings?.length || 0})</h3>
        <ul>
          {messages?.warnings?.map((warning, index) => (
            <li key={`warning-${index}`}>{warning}</li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Good Points ({messages?.goodPoints?.length || 0})</h3>
        <ul>
          {messages?.goodPoints?.map((point, index) => (
            <li key={`good-point-${index}`}>{point}</li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Minor Warnings ({messages?.minorWarnings?.length || 0})</h3>
        <ul>
          {messages?.minorWarnings?.map((warning, index) => (
            <li key={`minor-warning-${index}`}>{warning}</li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Scores and Metrics</h3>
        <ul>
          <li>SEO Score: {Math.ceil(seoScore || 0)}</li>
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