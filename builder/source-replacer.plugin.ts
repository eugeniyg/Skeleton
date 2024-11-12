import { access } from 'node:fs/promises';

// copypasted const from vite
const FS_PREFIX = `/@fs/`;

export const sourceReplacerPlugin = (sourcePath: string, replacePath: string) => {
  return {
    name: 'rollup-plugin-plt-source-replacer',
    enforce: 'pre',
    resolveId: {
      first: true,
      order: 'pre',
      sequential: true,
      async handler(source: string, importer: string, options: object): Promise<string | null> {
        if (!source.includes(sourcePath)) {
          return null;
        }

        // looks like its some virtual path
        if (!source.includes(process.cwd())) {
          return null;
        }

        if (source.startsWith(FS_PREFIX)) {
          source = source.slice(FS_PREFIX.length);
        }

        [source] = source.split('?', 2);

        // original source file not exists, something virtual, not interested in, fallback to other plugins flow
        try {
          await access(source);
        } catch {
          return null;
        }

        const replacedSource = source.replace(sourcePath, replacePath);

        // replaced source file not exists, fallback to other plugins flow
        try {
          await access(replacedSource);
        } catch {
          return null;
        }

        // @ts-expect-error - Vite plugin
        return this.resolve(replacedSource, importer, { skipSelf: true, ...options });
      },
    },
  };
};
