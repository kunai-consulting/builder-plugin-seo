import { registerCommercePlugin as registerPlugin } from "@builder.io/commerce-plugin-tools";
import { Builder } from "@builder.io/react";
import pkg from "../package.json";
import { SEOAnalysis } from "./seo-checker";
import * as React from 'react';

export const registerComponent = () => {
  const dummyProps = {
    keyword: 'my test',
    subKeywords: ['test 1', 'test 2']
  }

  Builder.register("editor.editTab", {
    name: (
      // @ts-ignore next-line
      <div>YoastSEO Plugin</div>
    ),
    component: () => <SEOAnalysis keyword={dummyProps.keyword} subKeywords={dummyProps.subKeywords} />,
  })};

/**
 * Instruct builder to require few settings before running the plugin code, for example when an apiKey for the service is required
 */
registerPlugin(
  {
    name: "SEOChecker",
    id: pkg.name,
    settings: [],
    // Builder will notify plugin user to configure the settings above, and call this function when it's filled
    onSave: async (actions) => {
      // if we need to save
    },
    ctaText: `Connect your Foo bar service account`,
  },
  async (settings) => {
    Builder.register("editor.onLoad", async () => {
      console.log("LOADING EDITOR");
      if (!Builder.registry['editor.editTab']) {
        registerComponent();
      }
    });

    return {};
  }
);
