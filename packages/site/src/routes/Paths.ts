export type RawPathsObject = {
  [key: string]: {
    Root: string;
    [key: string]: string;
  };
};

export const RawPaths = {
  Landing: {
    Root: '/',
    Landing: '/',
    Integrate: '/integrate',
    CreateNew: '/create-new',
  },
  MySnaaps: {
    Root: '/my-snaap',
    MySnaaps: '/',
  },
  MySnaap: {
    Root: '/my-snaap/:address',
    Networks: '/networks',
    MySnaap: '/',
    PastTxs: '/past-txs',
    Plugins: '/plugins',
  },
} as const;
RawPaths satisfies RawPathsObject;

type DynamicHandler<T extends RawPathsObject> = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [K in keyof T]: T[K]['Root'] extends `${infer _Left}/:${infer _Dynamic}`
    ? (dynamic: string) => Record<keyof T[K], string>
    : Record<keyof T[K], string>;
};

export const PathsStatic = Object.fromEntries(
  Object.entries(RawPaths).map(([rootName, rootPath]) => [
    rootName,
    Object.fromEntries(
      Object.entries(rootPath).map(([name, path]) => [
        name,
        name === 'Root' ? path : `${rootPath.Root === '/' ? '' : rootPath.Root}${path}`,
      ]),
    ),
  ]),
) as typeof RawPaths;

export const Paths = Object.fromEntries(
  Object.entries(RawPaths).map(([rootName, rootPath]) => {
    const isRootDynamic = rootPath.Root.includes('/:');

    if (isRootDynamic) {
      const left = rootPath.Root.split('/:')[0];
      const right = rootPath.Root.split('/:')[1]?.split('/')[1] ?? '';

      const entries = (dynamic: string) => {
        const root = `${left}/${dynamic}${right ? `/${right}` : ''}`;

        return Object.fromEntries(
          Object.entries(rootPath).map(([name, path]) => [
            name,
            name === 'Root' ? root : `${root === '/' ? '' : root}${path}`,
          ]),
        );
      };

      return [rootName, entries];
    }

    return [
      rootName,
      Object.fromEntries(
        Object.entries(rootPath).map(([name, path]) => [
          name,
          name === 'Root' ? path : `${rootPath.Root === '/' ? '' : rootPath.Root}${path}`,
        ]),
      ),
    ];
  }),
) as DynamicHandler<typeof RawPaths>;
