# @selectjs/core

A package to enhance your developing experience with selection, using the Selection API and Range API.

The latest source code and releases are on [GitHub](https://github.com/imrim12/selectjs.git).

> **WARNING**: This package is under heavy development, the APIs may be changed in the future!

> The developing branch is `dev`

Any contribution would be appreciate <3

I specially need support on unit testing to make the API as stable as possible!

## Supported APIs

- `defineSelectable` attach neccessary attributes to the element, got checked and called by default in some others APIs
- `getSelection` get the selection from the 2 sub APIs
  - `getSelectionInputOrTextarea` get the selection text, start, end and select direction
  - `getSelectionContenteditable` get the selection HTML, start, end, select direction is not supported
- `getSelectionRect` get the coresponding pixel-position of the selection by getting their bouding rects
- `setSelection` set the selection by using the 3 sub APIs
  - `setSelectionNode`
  - `setSelectionInputOrTextareaElement`
  - `setSelectionContenteditableElement`
- `setHighlight` create an underline by using the bounding boxes from `getSelectionRect`
- `removeSelectionContent` remove the selected content
- `replaceSelectionContent` replace the selected content with a new content
- `attachFloating` attach a floating tooltip to the selection bounding box
- `keepSelection` keep the selection from being deselected, helpful for interacting with Google Translate or Grammarly-like feature
- `watchSelection` watch the selection change and provide a callback hook for event handling

## Installation

```bash
npm i @selectjs/core

# Or with pnpm
pnpm add @selectjs/core

# Or with yarn
yarn add @selectjs/core
```

## Usage (WORK IN PROGRESS)

### Set selection

#### Example

Select any editable elements, input, textarea or element with contenteditable attribute from character to character using `start` and `end` options.

```typescript
import { setSelection } from "@selectjs/core"

const element = document.querySelector('input')
// const element = document.querySelector('textarea')
// const element = document.querySelector('[contenteditable]')

setSelection(element, { start: 0, end: 5 })
```

#### `setSelection` Options

|Option|Type|Description
|-|-|-
|`start`|`number`|Start offset of the selection
|`end`|`number`|End offset of the selection
|`keep`|`boolean`|Keep selecting the element until the selection is changed to empty and the element got blur

### Get selection

Get the current selection information of the selected element.

```typescript
import { getSelection } from "@selectjs/core"

const element = document.querySelector('input')
// const element = document.querySelector('textarea')
// const element = document.querySelector('[contenteditable]')

const result = getSelection(element)
```
