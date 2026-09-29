# Support for Frameworks


## Frameworks currently supported

### Dynamic frameworks

We support any language and framework that can run inside a Docker container, but we offer increased ease of use for the following:

* Ruby on Rails (native)
* Node (containerized)
* Next.JS (containerized)
* Laravel (containerized)

### Static site frameworks

At the moment Cloud supports the following static site frameworks: 

- [Jekyll](https://jekyllrb.com/) (Ruby)
- [Hugo](https://gohugo.io/) (Go)
- [Gatsby](https://www.gatsbyjs.com/) (React)
- [Next.js](https://nextjs.org/) (React)
- [Vue.js](https://vuejs.org/)
- [Nuxt.js](https://nuxtjs.org/) (Vue.js)
- [Svelte](https://svelte.dev/)
- [Middleman](https://middlemanapp.com/)
- [Docusaurus](https://docusaurus.io/) (React)

If your application uses another framework, please [complete this form](https://cloud66.typeform.com/to/Q7Q2kDSk) to share your preferred framework so that we can consider supporting it in future. 

If your application *does* use one of our supported frameworks, you may need to explicitly configure your application using a Manifest file. Our [getting started guide](../manifest/what-is-a-manifest-file.md) will get you up and running in a few minutes.

## Determining components versions

In general Cloud 66 will automatically detect and use the optimal versions of all your application's components, but if your app relies on unusual versions, then you may need to specify them explicitly. 

You can set versions at multiple levels in an application, but we will prioritise the version we use by scanning the files listed below, in descending order of preference. In other words we will use the "first" version we find.

### Specifying component versions as environment variables

You can set your application to use a specific component version via an environment variable. This will override any other versions specified in your application files. You can use keys prefixed with the underlying language followed by “_VERSION”, for example `NODE_VERSION`, `RUBY_VERSION` etc.

You can do this during the **initial build process** by clicking *Add Environment Variables* in the yellow application analysis block. 

You can do this with existing applications by clicking *Settings* → *Environment Variables.*

## Ruby version

We automatically detect your Ruby version in the following order:

`RUBY_VERSION` (env_var)

`manifest`

`Gemfile.lock`

`.ruby-version`

`.rvmrc`

If we find no version, we will use our default. 

## NodeJS version

We automatically detect your Node version in the following order:

`NODE_VERSION` (env_var)

`manifest`

`package-lock.json`

`.node-version`

`.nvmrc`