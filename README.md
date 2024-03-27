# @selectjs/core

A package to enhance your selection experience, using the Selection API and Range API.

The current version is version 0.0.1-rc.1

The latest source code and releases are on [GitHub](https://github.com/imrim12/selectjs.git).

## Installation

```bash
npm i @selectjs/core

# Or with pnpm
pnpm add @selectjs/core

# Or with yarn
yarn add @selectjs/core
```

## Usage

### 1. Set selection

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

### 2. Get selection

Get the current selection information of the selected element.

```typescript
import { getSelection } from "@selectjs/core"

const element = document.querySelector('input')
// const element = document.querySelector('textarea')
// const element = document.querySelector('[contenteditable]')

const result = getSelection(element)
```
