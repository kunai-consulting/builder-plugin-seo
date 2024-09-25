import { Builder, builder } from '@builder.io/react';
import { registerCommercePlugin as registerPlugin } from '@builder.io/commerce-plugin-tools';
import pkg from '../package.json';
import {
  Paper,
  AbstractResearcher,
  ContentAssessor,
  SEOAssessor,
} from 'yoastseo';
import React from 'react';
import { useState, useEffect } from 'react';
import appState from "@builder.io/app-context";
import { fastClone } from './utils';

interface AnalysisResult {
  results: Array<{ text: string }>;
}

interface YoastSEOAnalysisProps {
  value?: string;
  keyword?: string;
  title?: string;
  description?: string;
  url?: string;
}

export function YoastSEOAnalysis(props: YoastSEOAnalysisProps) {
  const [seoResults, setSeoResults] = useState<AnalysisResult | null>(null);
  const [
    readabilityResults,
    setReadabilityResults,
  ] = useState<AnalysisResult | null>(null);

  console.log("IN YOAST: ", fastClone(appState.designerState?.editingContentModel?.data));

  /**
   *  Option 2: Run through the page with the preview url, extract the words.
   * 
   */

  async function getStreamedHTML(url: string) {
    const response = await fetch(url);
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
  
    let result = '';
  
    while (true) {
      const { done, value } = await reader?.read();
      if (done) break;
      
      const chunk = decoder.decode(value, { stream: true });
      result += chunk;
  
      // Process the chunk here (e.g., update the DOM)
      console.log('Received chunk:', chunk);
    }
  
    return result;
  }

  useEffect(() => {
    async function grabData() {
      // const data = await fetch(appState.designerState?.editingContentModel?.previewUrl)
      const data = await getStreamedHTML(appState.designerState?.editingContentModel?.previewUrl);


      console.log('data', data);
      console.log('editing content: ', appState.designerState?.editingContentModel)
      console.log('url', appState.designerState?.editingContentModel?.previewUrl)

      return data;
    }

    grabData();
  })

  // const { value, keyword, title, description, url } = props;

  // useEffect(
  //   () => {
  //     const analyzeContent = () => {
  //       const paper = new Paper(value, {
  //         keyword,
  //         title,
  //         titleWidth: 600,
  //         description,
  //         url,
  //         permalink: url,
  //       });

  //       const researcher = new AbstractResearcher(paper);
  //       const contentAssessor = new ContentAssessor(researcher);
  //       const seoAssessor = new SEOAssessor(researcher);

  //       contentAssessor.assess(paper);
  //       seoAssessor.assess(paper);

  //       setSeoResults({ results: seoAssessor.getResults() });
  //       setReadabilityResults({ results: contentAssessor.getResults() });
  //     };

  //     analyzeContent();
  //   },
  //   [value, keyword, title, description, url]
  // );

  return (
    <div>
      <h3>SEO Analysis</h3>
      {seoResults && (
        <ul>
          {seoResults.results.map((result, index) => (
            <li key={index}>{result.text}</li>
          ))}
        </ul>
      )}
      <h3>Readability Analysis</h3>
      {readabilityResults && (
        <ul>
          {readabilityResults.results.map((result, index) => (
            <li key={index}>{result.text}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
