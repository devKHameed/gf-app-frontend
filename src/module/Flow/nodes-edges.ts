
const position = { x: 0, y: 0 };
const edgeType = 'buttonedge';

export const initialNodes = [
  { id: '1', type: 'textUpdater', position: { x: 0, y: 0 }, data: { value: 123 } },
  {
    id: '2',
    type: 'textUpdater',
    data: { label: 'node 2' },
    position,
  },
  {
    id: '2a', type: 'textUpdater',
    data: { label: 'node 2a' },
    position,
  },
  {
    id: '2b', type: 'textUpdater',
    data: { label: 'node 2b' },
    position,
  },
  {
    id: '2c', type: 'textUpdater',
    data: { label: 'node 2c' },
    position,
  },
  {
    id: '2d', type: 'textUpdater',
    data: { label: 'node 2d' },
    position,
  },
  {
    id: '3', type: 'textUpdater',
    data: { label: 'node 3' },
    position,
  },
  {
    id: '4', type: 'textUpdater',
    data: { label: 'node 4' },
    position,
  },
  {
    id: '5', type: 'textUpdater',
    data: { label: 'node 5' },
    position,
  },
  {
    id: '6',
     type: 'textUpdater',
    data: { label: 'output' },
    position,
  },
  { id: '7', type: 'textUpdater', data: { label: 'output' }, position },
];

export const initialEdges = [
  { id: 'e12', source: '1', target: '2', type: edgeType,  style: { stroke: 'red' , stokeWidth: '20px' } },
  { id: 'e13', source: '1', target: '3', type: edgeType, animated: true },
  { id: 'e22a', source: '2', target: '2a', type: edgeType, animated: true },
  { id: 'e22b', source: '2', target: '2b', type: edgeType, animated: true },
  { id: 'e22c', source: '2', target: '2c', type: edgeType, animated: true },
  { id: 'e2c2d', source: '2c', target: '2d', type: edgeType, animated: true },
  { id: 'e45', source: '4', target: '5', type: edgeType, animated: true },
  { id: 'e56', source: '5', target: '6', type: edgeType, animated: true },
  { id: 'e57', source: '5', target: '7', type: edgeType, animated: true },
];