import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'hauqaalv',
    dataset: 'production'
  },
  studioHost: 'logosphere',
  deployment: {
    appId: 'uvcbttsvxe8vzmlgm50cqsuw',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/cli#auto-updates
     */
    autoUpdates: true,
  }
})
