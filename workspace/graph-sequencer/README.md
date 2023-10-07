# @pnpm/graph-sequencer

> graph-sequencer

[![npm version](https://img.shields.io/npm/v/@pnpm/graph-sequencer.svg)](https://www.npmjs.com/package/@pnpm/graph-sequencer)

## Installation

```sh
pnpm add @pnpm/graph-sequencer
```


## Usage

```ts
  expect(graphSequencer(new Map([
    [0, [1]],
    [1, [2]],
    [2, [3]],
    [3, [0]],
  ]), [0, 1, 2, 3])).toStrictEqual(
    {
      safe: false,
      chunks: [[0, 1, 2, 3]],
      cycles: [[0, 1, 2, 3]],
    }
  )
```


## License

MIT
