import path from 'path'
import { fileURLToPath } from 'url'

function relativePath(target) {
  return path.join(path.dirname(fileURLToPath(import.meta.url)), target)
}
function markdown(string) {
  // Takes the first indent and trims that length from everywhere.
  // Markdown templates don't like the extra space at the beginning.
  const target = string[0]
  const trimSize = /^\s+/.exec(string)[0].length
  return target
    .split('\n')
    .map((line) => line.substr(trimSize - 1))
    .join('\n')
}

function websiteConfig(DOC) {
  if (DOC === 'swap') {
    return {
      appTitle: 'AniList',
      graphqlUrl: 'https://graphql.anilist.co/',
      siteRoot: '/anilist',
      factories: {
        Json: {},
        CountryCode: 'CA',
        FuzzyDateInt: 1234567890,
      },
    }
  } else if (DOC === 'oracle') {
    return {
      appTitle: 'GraphiQL Demo',
      graphqlUrl: 'https://countries.trevorblades.com/',
      siteRoot: '/graphiql-demo',
      factories: {
        _Any: 'anything',
      },
    }
  } else if (DOC === 'accounting') {
    return {
      appTitle: 'accounting',
      graphqlUrl: 'https://countries.trevorblades.com/',
      siteRoot: '/graphiql-demo',
      factories: {
        _Any: 'anything',
      },
    }
  }
  else {
    throw new Error(`Unknown website: ${DOC}`)
  }
}

export function allConfigs() {
  return [websiteConfig('swap'), websiteConfig('oracle'), websiteConfig('accounting')]
}

const config = websiteConfig(process.env.DOC || 'swap')

const otherLinks = allConfigs().filter(
  (current) => current.siteRoot !== config.siteRoot,
)

export default {
  introspection: {
    type: 'url',
    url: config.graphqlUrl,
  },
  website: {
    template: 'carbon-multi-page',
    output: relativePath(`./docs${config.siteRoot}`),
    options: {
      appTitle: config.appTitle,
      siteRoot: config.siteRoot,
      appLogo: 'https://deepwaters.xyz/static/deepwatersLogoVatnForm-188c211f7e15dc1f10371d2d8a8754e3.svg',
      appFavicon: 'https://deepwaters.xyz/icons/icon-72x72.png',
      siteMeta: {
        description: "GraphQL API.",
        'og:description': "description",
      },
      externalLinks: otherLinks.map((current) => ({
        href: current.siteRoot,
        label: current.appTitle,
        group: 'Other Schemas',
      })),
      pages: [
        {
          title: 'Welcome',
          content: markdown`
            # Welcome to [Random](https://google.com)'s GraphQL documentation
          `,
        }
      ],
      queryGenerationFactories: config.factories,
    },
  },
}
