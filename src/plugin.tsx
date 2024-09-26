import { registerCommercePlugin as registerPlugin } from "@builder.io/commerce-plugin-tools";
import { Builder, builder } from "@builder.io/react";
import pkg from "../package.json";
import appState from "@builder.io/app-context";
import {
  getSEOReviewModel,
  getSEOReviewModelTemplate,
  registerComponent,
  registerDesignToken,
} from "./utils";

export async function fetchBuilderContent(apiKey: string) {
  const modelName = "page";
  const url = `https://cdn.builder.io/api/v3/content/page?apiKey=${apiKey}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("DATA: ", data);
    return data;
  } catch (error) {
    console.error("Error fetching Builder.io content:", error);
    throw error;
  }
}

const apiKey = process.env.PUBLIC_BUILDER_API_KEY ?? '';

/**
 * Instruct builder to require few settings before running the plugin code, for example when an apiKey for the service is required
 */
registerPlugin(
  {
    name: "YoastSEO",
    id: pkg.name,
    settings: [
      {
        name: "apiKey",
        type: "string",
        helperText: "get the api key from your example.com dashboard",
        required: true,
      },
    ],
    // Builder will notify plugin user to configure the settings above, and call this function when it's filled
    onSave: async (actions) => {
      // adds a new model, only once when the user has added their api key
      if (!getSEOReviewModel()) {
        actions.addModel(getSEOReviewModelTemplate());
      }
    },
    ctaText: `Connect your Foo bar service account`,
  },
  async (settings) => {
    Builder.register("editor.onLoad", async () => {
      console.log("LOADING EDITOR");
      if (!Builder.registry['editor.editTab']) {
        registerComponent();
      }
      if (!Builder.registry['editor.settings']) {
        registerDesignToken();
      }
    });

    return {};
  }
);
