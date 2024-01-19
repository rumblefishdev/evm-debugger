# Development

## Frontend Setup

Setup your local environment for the evm-debugger frontend.

### Setup Local Frontend

1. **Clone Repository**

   - Clone repository using:

     ```bash
     git clone <repository-url>
     ```

2. **Navigate to Repository Root Directory**

   - Open up your terminal and navigate to the root directory of the cloned repository.

     ```bash
     cd <repository-directory>
     ```

3. **Install Lerna Globally**

   - You need Lerna to manage our project. Run the following command to install Lerna globally:

     ```bash
     npm i -g lerna@^6.0.3
     ```

4. **Run Lerna Bootstrap**

   - Let's set things up with Lerna. Run the following command:

     ```bash
     lerna bootstrap
     ```

5. **Build Every Package**

   - It's time to build all the packages in one go. Execute:

     ```bash
     lerna run build
     ```

6. **Set Up Environment Variables**

   - Head into the `package/frontend` directory and create a file named `.env.local`. Populate it with the necessary data.

7. **Start the Frontend**

   - Back in the root directory, run:

     ```bash
     npm run frontend:start
     ```

8. **Ready to code!**
   - Your application is up and running at `localhost:3000`.

## Testing

You must fetch abis and sources for all new test transactions added to `./packages/analyzer/test` by running `npm run analyzer:test:fetch-abis`.

## Deploy packages

To deploy packages, you need to export the github token:

```bash
export GH_TOKEN=paste_your_token_here
```

## RF lerna

Just run command and follow instructions

```bash
rf-lerna release
```

## Standard lerna

## Deploy single package to staging

```bash
lerna version prerelease --conventional-prerelease=@evm-debuger/frontend
```

This will create a release with alpha, that CI deploys to staging environment.

## Deploy single package to production

```bash
lerna version minor --conventional-prerelease=@evm-debuger/frontend
lerna version patch --conventional-prerelease=@evm-debuger/frontend --force-publish
```

This will create a release, that CI deploys to production environment.
Allowed bump options: `major', 'minor', 'patch', 'prerelease'
