import { fetchAbisForTestTransactions } from './scriptHelper'

fetchAbisForTestTransactions()
  .then(() => console.log('Done'))
  .catch(console.error)
