import React from 'react';
import { useState, useEffect } from 'react';
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
  previewUrl: string,
}

async function getSeoResults({ setResults, previewUrl }: PluginOpts) {
  const response = await fetch(previewUrl, { method: 'GET', mode: 'cors' });
  const html = await response.text();

  console.log('HTML: ', html)

  const contentJson = {
    title: 'Does Progressive raise your rates after 6 months?',
    htmlText: html,
    keyword: 'progressive',
    subKeywords: ['car insurance', 'rates', 'premiums', 'save money', 'US'],
    metaDescription: 'Find out if Progressive raises your rates after 6 months and what factors can impact your insurance premiums. Learn how to save money on car insurance in the US.',
    languageCode: 'en',
    countryCode: 'us'
  };

  const seoCheck = new SeoCheck(contentJson, appState.designerState?.editingContentModel?.previewUrl || 'https://example.com');

  const newResults = await seoCheck.analyzeSeo();
  
  setResults(newResults);
}

export function SEOAnalysis(props) {
  const [results, setResults] = useState<Results | undefined>();

  const pluginOpts: PluginOpts = {
    setResults: (newResults: Results) => setResults(newResults),
    previewUrl: appState.designerState?.editingContentModel?.previewUrl || '',
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
    <div className="seo-analysis-results">
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
          <li>SEO Score: {seoScore}</li>
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