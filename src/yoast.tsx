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

interface AnalysisResult {
  results: Array<{ text: string }>;
}

interface YoastSEOAnalysisProps {
  value: string;
  keyword: string;
  title: string;
  description: string;
  url: string;
}

export function YoastSEOAnalysis(props: YoastSEOAnalysisProps) {
  const [seoResults, setSeoResults] = useState<AnalysisResult | null>(null);
  const [
    readabilityResults,
    setReadabilityResults,
  ] = useState<AnalysisResult | null>(null);

  const { value, keyword, title, description, url } = props;

  useEffect(
    () => {
      const analyzeContent = () => {
        const paper = new Paper(value, {
          keyword,
          title,
          titleWidth: 600,
          description,
          url,
          permalink: url,
        });

        const researcher = new AbstractResearcher(paper);
        const contentAssessor = new ContentAssessor(researcher);
        const seoAssessor = new SEOAssessor(researcher);

        contentAssessor.assess(paper);
        seoAssessor.assess(paper);

        setSeoResults({ results: seoAssessor.getResults() });
        setReadabilityResults({ results: contentAssessor.getResults() });
      };

      analyzeContent();
    },
    [value, keyword, title, description, url]
  );

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
