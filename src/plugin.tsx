import { registerCommercePlugin as registerPlugin } from '@builder.io/commerce-plugin-tools';
import pkg from '../package.json';
import appState from '@builder.io/app-context';
import {
  getSEOReviewModel,
  getSEOReviewModelTemplate,
  registerContentAction,
  getIframeHTMLContent,
  showReviewNotifications,
  fastClone,
} from './utils';

/**
 * Instruct builder to require few settings before running the plugin code, for example when an apiKey for the service is required
 */
registerPlugin(
  {
    name: 'SEOReview',
    id: pkg.name,
    settings: [
      {
        name: 'apiKey',
        type: 'string',
        helperText: 'get the api key from your example.com dashboard',
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
  // settings is a map of the settings fields above
  async (settings) => {
    // press the vertical dots in the content editor to see this in action
    registerContentAction();

    return {};
  }
);
