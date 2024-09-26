import React, { useEffect, useState } from 'react';
import '@emotion/core';
import { appState } from '@builder.io/app-context';
import { Builder } from '@builder.io/react';
import { Button } from '@material-ui/core';
import { YoastSEOAnalysis } from './yoast';

export const registerComponent = () => {
  Builder.register('editor.editTab', {
    name: (
      // @ts-ignore next-line
      <div>YoastSEO Plugin</div>
    ),
    component: () => <YoastSEOAnalysis />,
  });
};

export const registerDesignToken = () => {
  Builder.register('editor.settings', {
    designTokensOptional: true,
    designTokens: {
      colors: [
        { name: 'Kunai Red', value: '#E95A51' },
        { name: 'Kunai Navy', value: '#2F3652' },
        { name: 'Kunai Teal', value: '#D6E9D9' },
        { name: 'Kunai Blue', value: '#8196D8' },
      ],
      fontFamily: [
        { name: 'TitlingGothicFB', value: 'TitlingGothicFB Normal' },
        { name: 'Warnock Pro', value: 'Warnock Pro' },
      ],
    },
  });
};

export const fastClone = (obj: any) =>
  obj === undefined ? undefined : JSON.parse(JSON.stringify(obj));

export const seoReviewModelName = 'seo-review-history';
export const getSEOReviewModel = () =>
  appState.models.result.find((m: any) => m.name === seoReviewModelName);
export const getSEOReviewModelTemplate = () => ({
  '@version': 2,
  name: seoReviewModelName,
  kind: 'data' as const,
  subType: '',
  schema: {},
  publishText: 'Authorize',
  unPublishText: 'Cancel',
  fields: [
    {
      '@type': '@builder.io/core:Field',
      name: 'description',
      type: 'text',
      required: false,
      helperText: 'Example field',
    },
  ],
  helperText: 'Seo Reviews History',
  publicWritable: false,
  publicReadable: false,
  strictPrivateRead: true,
  strictPrivateWrite: true,
  showMetrics: false,
  showAbTests: false,
  showTargeting: false,
  showScheduling: false,
  hideFromUI: false,
});

export const showReviewNotifications = (jobId: string) => {
  appState.snackBar.show(
    <div css={{ display: 'flex', alignItems: 'center' }}>Done!</div>,
    8000,
    <Button
      color="primary"
      css={{
        pointerEvents: 'auto',
        ...(appState.document.small && {
          width: 'calc(100vw - 90px)',
          marginRight: 45,
          marginTop: 10,
          marginBottom: 10,
        }),
      }}
      variant="contained"
      onClick={async () => {
        appState.location.go(`/content/${jobId}`);
        appState.snackBar.open = false;
      }}
    >
      Go to review details
    </Button>
  );
};
