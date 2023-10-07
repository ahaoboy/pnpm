import { graphSequencer } from '../src'

test('base test case0', () => {
  expect(graphSequencer(new Map([
    ['a', ['a']],
    ['b', ['b']],
    ['c', ['c']],
  ]
  ), ['a', 'b', 'c'])).toStrictEqual(
    {
      safe: true,
      chunks: [['a', 'b', 'c']],
      cycles: [
        ['a'], ['b'], ['c'],
      ],
    }
  )
})

test('base test case1', () => {
  expect(graphSequencer(new Map([
    ['a', ['b', 'c']],
    ['b', ['b']],
    ['c', ['b', 'c']]]
  ), ['a', 'b', 'c'])).toStrictEqual(
    {
      safe: true,
      chunks: [['b', 'c'], ['a']],
      cycles: [
        ['b'], ['c'],
      ],
    }
  )
})

test('base test case2', () => {
  expect(graphSequencer(new Map([
    ['a', ['b', 'c']],
    ['b', []],
    ['c', ['b']]]
  ), ['a', 'b', 'c'])).toStrictEqual(
    {
      safe: true,
      chunks: [['b'], ['c'], ['a']],
      cycles: [],
    }
  )
})

test('base test case3', () => {
  expect(graphSequencer(new Map([
    ['a', ['b', 'c']],
    ['b', []],
    ['c', []],
    ['d', ['a']],
    ['e', ['a', 'b', 'c']]]
  ), ['a', 'd', 'e'])).toStrictEqual(
    {
      safe: true,
      chunks: [['a'], ['d', 'e']],
      cycles: [],
    }
  )
})

test('graph with no dependencies', () => {
  expect(graphSequencer(new Map([
    [0, []],
    [1, []],
    [2, []],
    [3, []],
  ]), [0, 1, 2, 3])).toStrictEqual(
    {
      safe: true,
      chunks: [[0, 1, 2, 3]],
      cycles: [],
    }
  )
})

test('graph with no dependencies sub graph', () => {
  expect(graphSequencer(new Map([
    [0, []],
    [1, []],
    [2, []],
    [3, []],
  ]), [0, 1, 2])).toStrictEqual(
    {
      safe: true,
      chunks: [[0, 1, 2]],
      cycles: [],
    }
  )
})

test('graph with multiple dependencies on one item', () => {
  expect(graphSequencer(new Map([
    [0, [3]],
    [1, [3]],
    [2, []],
    [3, []],
  ]), [0, 1, 2, 3])).toStrictEqual(
    {
      safe: true,
      chunks: [[2, 3], [0, 1]],
      cycles: [],
    }
  )
})

test('graph with resolved cycle', () => {
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
})

test('graph with resolved cycle sub graph', () => {
  expect(graphSequencer(new Map([
    [0, [1]],
    [1, [2]],
    [2, [3]],
    [3, [0]],
  ]), [0, 1, 2])).toStrictEqual(
    {
      safe: true,
      chunks: [[2], [1], [0]],
      cycles: [],
    }
  )
})

test('graph with resolved cycle with multiple unblocked deps', () => {
  expect(graphSequencer(new Map([
    [0, [3]],
    [1, [3]],
    [2, [3]],
    [3, [0]],
  ]), [0, 1, 2, 3])).toStrictEqual(
    {
      safe: false,
      chunks: [
        [0, 3],
        [1, 2],
      ],
      cycles: [[0, 3]],
    }
  )
})

test('graph with resolved cycle with multiple unblocked deps sub graph', () => {
  expect(graphSequencer(new Map([
    [0, [3]],
    [1, [3]],
    [2, [3]],
    [3, [0]],
  ]), [0, 1, 2])).toStrictEqual(
    {
      safe: true,
      chunks: [
        [0, 1, 2],
      ],
      cycles: [],
    }
  )
})

test('graph with two cycles', () => {
  expect(graphSequencer(new Map([
    [0, [1]],
    [1, [0]],
    [2, [3]],
    [3, [2]],
  ]), [0, 1, 2, 3])).toStrictEqual(
    {
      safe: false,
      chunks: [[0, 1, 2, 3]],
      cycles: [
        [0, 1],
        [2, 3],
      ],
    }
  )
})

test('graph with multiple cycles', () => {
  expect(graphSequencer(new Map([
    [0, [2]],
    [1, [0, 3]],
    [2, [1]],
    [3, [2, 4]],
    [4, []],
  ]), [0, 1, 2, 3, 4])).toStrictEqual(
    {
      safe: false,
      chunks: [[4], [0, 2, 1], [3]],
      cycles: [[0, 2, 1]],
    }
  )
})

test('graph with multiple cycles', () => {
  expect(graphSequencer(new Map([
    [0, [1]],
    [1, [3]],
    [2, []],
    [3, [1, 2]],
  ]), [0, 1, 2, 3])).toStrictEqual(
    {
      safe: false,
      chunks: [[2], [1, 3], [0]],
      cycles: [[1, 3]],
    }
  )
})

test('graph with full conn', () => {
  expect(graphSequencer(new Map([
    [0, [1, 2, 3]],
    [1, [0, 2, 3]],
    [2, [0, 1, 3]],
    [3, [0, 1, 2]],
    [4, [1]],
  ]), [0, 1, 2, 3, 4])).toStrictEqual(
    {
      safe: false,
      chunks: [[0, 1, 2, 3], [4]],
      cycles: [
        [0, 1],
        [2, 3],
      ],
    }
  )
})

test('graph with full conn sub graph', () => {
  expect(graphSequencer(new Map([
    [0, [1, 2, 3]],
    [1, [0, 2, 3]],
    [2, [0, 1, 3]],
    [3, [0, 1, 2]],
    [4, [1]],
  ]), [1, 4])).toStrictEqual(
    {
      safe: true,
      chunks: [[1], [4]],
      cycles: [],
    }
  )
})

test('graph with full conn sub graph', () => {
  expect(graphSequencer(new Map([
    [0, [1, 2, 3]],
    [1, [0, 2, 3]],
    [2, [0, 1, 3]],
    [3, [0, 1, 2]],
    [4, [1]],
  ]), [0, 1, 4])).toStrictEqual(
    {
      safe: false,
      chunks: [[0, 1], [4]],
      cycles: [[0, 1]],
    }
  )
})

test('graph with self cycle', () => {
  expect(graphSequencer(new Map([
    [0, [0]],
    [1, [1]],
    [2, [2]],

  ]), [0, 1, 2])).toStrictEqual(
    {
      safe: true,
      chunks: [[0, 1, 2]],
      cycles: [[0], [1], [2]],
    }
  )
})

test('graph with self cycle sub graph', () => {
  expect(graphSequencer(new Map([
    [0, [0]],
    [1, [1]],
    [2, [2]],

  ]), [0, 1])).toStrictEqual(
    {
      safe: true,
      chunks: [[0, 1]],
      cycles: [[0], [1]],
    }
  )
})

test('graph with two self cycle', () => {
  expect(graphSequencer(new Map([
    [0, [1, 2]],
    [1, [1]],
    [2, [2]],

  ]), [0, 1, 2])).toStrictEqual(
    {
      safe: true,
      chunks: [[1, 2], [0]],
      cycles: [[1], [2]],
    }
  )
})

test('graph with two self cycle sub graph', () => {
  expect(graphSequencer(new Map([
    [0, [1, 2]],
    [1, [1]],
    [2, [2]],

  ]), [1, 2])).toStrictEqual(
    {
      safe: true,
      chunks: [[1, 2]],
      cycles: [[1], [2]],
    }
  )
})

test('graph with many nodes', () => {
  expect(graphSequencer(new Map([
    [0, [1, 2]],
    [1, []],
    [2, []],
    [3, [0]],
    [4, [0, 1, 2]],
  ]), [0, 1, 2, 3, 4])).toStrictEqual(
    {
      safe: true,
      chunks: [[1, 2], [0], [3, 4]],
      cycles: [],
    }
  )
})

test('graph with many nodes sub graph', () => {
  expect(graphSequencer(new Map([
    [0, [1, 2]],
    [1, []],
    [2, []],
    [3, [0]],
    [4, [0, 1, 2]],
  ]), [0, 3, 4])).toStrictEqual(
    {
      safe: true,
      chunks: [[0], [3, 4]],
      cycles: [],
    }
  )
})
