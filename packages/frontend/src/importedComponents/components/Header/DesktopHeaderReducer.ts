import { submenusWhichAction } from '../../utils/SubmenusUtils'
import type { SUBMENUS } from '../../utils/SubmenusUtils'

export const doChangeCollapseUnmounted = (payload: boolean) => ({
  type: 'changeCollapseUnmounted',
  payload,
})

export const doSetIsUnwantedTouch = (payload: boolean) => ({
  type: 'setIsUnwantedTouch',
  payload,
})
export const doChangeHoverState = (type: string, payload: boolean) => ({
  type,
  payload,
})
export const doSetCurrentSub = (sub: SUBMENUS | null) => ({
  type: 'setCurrentSubmenu',
  payload: sub,
})
export const doOnSubmenuClose = (sub: SUBMENUS | null) => ({
  type: `onSubmenuClose_${submenusWhichAction[sub]}`,
  payload: sub,
})

export interface IHeaderDesktopReducerState {
  isCollapseUnmounted: boolean
  servicesHover: boolean
  careersHover: boolean
  resourceHover: boolean
  productsHover: boolean
  prevSubmenu: null | SUBMENUS
  currentSubmenu: null | SUBMENUS
  isUnwantedTouch: boolean
}

export const initialState = {
  servicesHover: false,
  resourceHover: false,
  productsHover: false,
  prevSubmenu: null,
  isUnwantedTouch: false,
  isCollapseUnmounted: true,
  currentSubmenu: null,
  careersHover: false,
}

export function reducer(state: IHeaderDesktopReducerState, action) {
  switch (action.type) {
    case 'changeCollapseUnmounted': {
      return {
        ...state,
        isCollapseUnmounted: action.payload,
      }
    }
    case 'setServicesHover': {
      return {
        ...state,
        servicesHover: action.payload,
      }
    }
    case 'setCareersHover': {
      return {
        ...state,
        careersHover: action.payload,
      }
    }
    case 'setResourceHover': {
      return {
        ...state,
        resourceHover: action.payload,
      }
    }
    case 'setProductsHover': {
      return {
        ...state,
        productsHover: action.payload,
      }
    }

    case 'setPrevSubmenu': {
      return {
        ...state,
        prevSubmenu: action.payload,
      }
    }
    case 'setCurrentSubmenu': {
      return {
        ...state,
        currentSubmenu: action.payload,
      }
    }

    case 'setIsUnwantedTouch': {
      return {
        ...state,
        isUnwantedTouch: action.payload,
      }
    }
    case 'onSubmenuClose_setServicesHover': {
      return {
        ...state,
        servicesHover: false,
        prevSubmenu: action.payload,
        currentSubmenu: null,
      }
    }
    case 'onSubmenuClose_setProductsHover': {
      return {
        ...state,
        productsHover: false,
        prevSubmenu: action.payload,
        currentSubmenu: null,
      }
    }
    case 'onSubmenuClose_setCareersHover': {
      return {
        ...state,
        prevSubmenu: action.payload,
        currentSubmenu: null,
        careersHover: false,
      }
    }
    case 'onSubmenuClose_setResourceHover': {
      return {
        ...state,
        resourceHover: false,
        prevSubmenu: action.payload,
        currentSubmenu: null,
      }
    }
    default: {
      return { ...state }
    }
  }
}
