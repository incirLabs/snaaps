export const RawPaths = {
  Landing: {
    Root: '/',
    Landing: '/',
    Integrate: '/integrate',
    CreateNew: '/create-new',
  },
  MySnaap: {
    Root: '/my-snaap',
    MySnaap: '/',
    Networks: '/networks',
    Plugins: '/plugins',
  },
};

export const Paths: typeof RawPaths = Object.fromEntries(
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
