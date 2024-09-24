declare module "yoastseo" {
  export class Paper {
    constructor(
      text: string,
      options: {
        keyword: string;
        title: string;
        titleWidth: number;
        description: string;
        url: string;
        permalink: string;
      }
    );
  }

  export class AbstractResearcher {
    constructor(paper: Paper);
  }

  export class ContentAssessor {
    constructor(researcher: AbstractResearcher);
    assess(paper: Paper): void;
    getResults(): Array<{ text: string }>;
  }

  export class SEOAssessor {
    constructor(researcher: AbstractResearcher);
    assess(paper: Paper): void;
    getResults(): Array<{ text: string }>;
  }
}

declare module "rollup-plugin-serve" {
  interface ServeOptions {
    contentBase?: string;
    port?: number;
    host?: string;
    headers?: Record<string, string>;
    // Add other options as needed
  }

  function serve(options?: ServeOptions): import("rollup").Plugin;
  export default serve;
}
