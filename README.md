### Development

To start development, you have to:

```
npm i -g lerna@^6.0.3
npm i
lerna bootstrap
lerna run build
npm run frontend:start
```

### Testing

You must fetch abis and sources for all new test transactions added to `./packages/analyzer/test` by running `npm run analyzer:test:fetch-abis`.

### Deploy packages

To deploy packages, you need to export the github token:

```bash
export GH_TOKEN=paste_your_token_here
```

#### RF lerna

Just run command and follow instructions

```bash
rf-lerna release
```

#### Standard lerna

##### Deploy single package to staging

```bash
lerna version prerelease --conventional-prerelease=@evm-debuger/frontend
```

This will create a release with alpha, that CI deploys to staging environment.

##### Deploy single package to production

```bash
lerna version minor --conventional-prerelease=@evm-debuger/frontend
```

This will create a release, that CI deploys to production environment.
Allowed bump options: `major', 'minor', 'patch', 'prerelease'
