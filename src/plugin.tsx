import { registerCommercePlugin as registerPlugin } from "@builder.io/commerce-plugin-tools";
import { Builder } from "@builder.io/react";
import pkg from "../package.json";
import { SEOAnalysis } from "./seo-checker";
import * as React from "react";
import builder from "@builder.io/react";

const getPageData = async (apiKey: string) => {
  // TODO: make sure page model name is not hardcoded
  const url = `https://cdn.builder.io/api/v3/content/page?apiKey=${apiKey}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching Builder.io content:", error);
    throw error;
  }
};

export const registerComponent = async (apiKey: string) => {
  const pageData = await getPageData(apiKey);

  const dummyProps = {
    keyword: "my test",
    subKeywords: ["test 1", "test 2"],
  };

  Builder.register("editor.editTab", {
    name: <div>SEO Checker</div>,
    component: () => (
      <SEOAnalysis
        keyword={dummyProps.keyword}
        subKeywords={dummyProps.subKeywords}
        pageData={pageData}
      />
    ),
  });
};

/**
 * Instruct builder to require few settings before running the plugin code, for example when an apiKey for the service is required
 */
registerPlugin(
  {
    name: "SEOChecker",
    id: pkg.name,
    settings: [
      {
        name: "apiKey",
        type: "string",
        helperText:
          "SEO Checker needs the API key for access to page model data",
        required: true,
      },
    ],
    // Builder will notify plugin user to configure the settings above, and call this function when it's filled
    onSave: async (actions) => {
      // if we need to save
    },
    ctaText: `Connect to SEO Checker`,
  },
  async (settings) => {
    Builder.register("editor.onLoad", async () => {
      console.log("PLUGIN SETTINGS", settings);
      const apiKey = settings.get("apiKey");
      builder.init(apiKey);

      console.log("LOADING EDITOR");
      if (!Builder.registry["editor.editTab"]) {
        registerComponent(apiKey);
      }
    });

    return {};
  }
);
