#!/usr/bin/env node

require('dotenv').config()
const { program } = require('commander')
const BetorCatalog = require('./betorCatalog')

program
  .option('-b, --betor-api-url <string>', 'Betor API Base URL', 'http://localhost:8000')
  .option('-a, --betor-api-authorization <string>', 'Betor API Basic Authorization Header value')
  .argument('<action>', 'build-items|serve|build')
  .action(async (action, options) => {
    console.log('action:', action)
    console.log('options:', options)
    const betorCatalog = new BetorCatalog(options)
    switch (action) {
      case 'build-items':
        await betorCatalog.buildItems()
        break
      case 'serve':
        await betorCatalog.serve()
        break
      case 'build':
        await betorCatalog.build()
        break
      default:
        console.warn(`Invalid action: ${action}`)
    }
  })

program.parse()
