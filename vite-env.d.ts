// The reference to `vite/client` was removed to fix a "Cannot find type definition file" error.
// The following declaration for `process` is added to support using `process.env.API_KEY`
// as required by the @google/genai guidelines. This avoids a potential "Cannot find name 'process'" error.

declare var process: {
  env: {
    readonly API_KEY: string;
  };
};
