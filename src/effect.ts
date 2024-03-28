// Enable or disable the selection effect that will affect the behavior of set API and watch API
let DISABLE_SELECTION_EFFECT = false

export function disableEffect() {
  DISABLE_SELECTION_EFFECT = true
}

export function enableEffect() {
  DISABLE_SELECTION_EFFECT = false
}

export function isEffectDisabled() {
  return DISABLE_SELECTION_EFFECT
}
