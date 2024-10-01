# @builder.io/seo-checker

@builder.io/seo-checker is a powerful SEO analysis tool designed to help you optimize your Builder.io projects for search engines. This plugin provides comprehensive on-page SEO analysis, allowing you to quickly evaluate and improve your content's search engine friendliness.

## Features

- **Keyword Analysis**: Measure keyword density and frequency, including sub-keyword analysis
- **SEO Insights**: Receive actionable warnings and positive feedback on your SEO implementation
- **Link Evaluation**: Analyze internal and outbound links, including checks for duplicates
- **Keyword Placement**: Verify optimal keyword positioning within your content
- **SEO Scoring**: Get an overall SEO score and keyword-specific scores
- **Content Analysis**: Evaluate word count and content structure
- **Meta Description Optimization**: Check length, placement, and keyword usage in meta descriptions
- **Heading Structure Analysis**: Examine H1-H6 tags for keyword usage and proper hierarchy

@builder.io/seo-checker is an essential tool for Builder.io users looking to enhance their content's search engine visibility. While it provides valuable insights based on standard on-page SEO rules, it should be used as a supplementary tool in your overall SEO strategy.

## Installation

- clone this repo
- `cd plugins/example-seo-review`
- `npm install`
- `npm run start`

Now the plugin will be running on `http://localhost:1268/plugin.system.js`

- Go to your Builder account settings, and add the local plugin to your list of plugins:

```
http://localhost:1268/plugin.system.js?pluginId=@builder.io/seo-checker
```

*** Notice the pluginId param in the path above, it's necessary to save the plugin settings.

