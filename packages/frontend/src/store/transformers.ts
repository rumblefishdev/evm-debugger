import { createTransform } from 'redux-persist'

const SetTransform = createTransform(
  // transform state on its way to being serialized and persisted.
  (inboundState: any, key) => {
    // convert mySet to an Array.
    return { ...inboundState, mySet: [...inboundState.mySet] }
  },
  // transform state being rehydrated
  (outboundState: any, key) => {
    // convert mySet back to a Set.
    return { ...outboundState, mySet: new Set(outboundState.mySet) }
  },
  // define which reducers this transform gets called for.
  { whitelist: ['analyzerReducer'] },
)

export default SetTransform
