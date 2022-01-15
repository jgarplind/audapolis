import { paste } from './edit';
import { emptyDocument, Paragraph } from '../../core/document';
import { editorDefaults, EditorState } from './types';
import { assertSome } from '../../util';

const testContent: Paragraph[] = [
  {
    speaker: 'paragraph_01',
    content: [
      { type: 'artificial_silence', length: 1 },
      { type: 'artificial_silence', length: 1 },
      { type: 'artificial_silence', length: 1 },
    ],
  },
  {
    speaker: 'paragraph_02',
    content: [
      { type: 'artificial_silence', length: 1 },
      { type: 'artificial_silence', length: 1 },
      { type: 'artificial_silence', length: 1 },
    ],
  },
];

test('test paste merge', () => {
  const state: EditorState = {
    ...editorDefaults,
    document: { ...emptyDocument, content: JSON.parse(JSON.stringify(testContent)) },
    currentTimePlayer: 1.0,
  };
  assertSome(paste.reducers);
  assertSome(paste.reducers.fulfilled);
  paste.reducers.fulfilled(state, {
    ...emptyDocument,
    content: [
      {
        speaker: 'paragraph_01',
        content: [
          { type: 'artificial_silence', length: 1 },
          { type: 'artificial_silence', length: 1 },
          { type: 'artificial_silence', length: 1 },
        ],
      },
    ],
  });
  expect(state.document.content).toMatchObject([
    {
      speaker: 'paragraph_01',
      content: [
        { type: 'artificial_silence', length: 1 },
        { type: 'artificial_silence', length: 1 },
        { type: 'artificial_silence', length: 1 },
        { type: 'artificial_silence', length: 1 },
        { type: 'artificial_silence', length: 1 },
        { type: 'artificial_silence', length: 1 },
      ],
    },
    {
      speaker: 'paragraph_02',
      content: [
        { type: 'artificial_silence', length: 1 },
        { type: 'artificial_silence', length: 1 },
        { type: 'artificial_silence', length: 1 },
      ],
    },
  ]);
});
test('test paste non-merge', () => {
  const state: EditorState = {
    ...editorDefaults,
    document: { ...emptyDocument, content: JSON.parse(JSON.stringify(testContent)) },
    currentTimePlayer: 1.0,
  };
  assertSome(paste.reducers);
  assertSome(paste.reducers.fulfilled);
  paste.reducers.fulfilled(state, {
    ...emptyDocument,
    content: [
      {
        speaker: 'paragraph_02',
        content: [
          { type: 'artificial_silence', length: 1 },
          { type: 'artificial_silence', length: 1 },
          { type: 'artificial_silence', length: 1 },
        ],
      },
    ],
  });
  expect(state.document.content).toMatchObject([
    {
      speaker: 'paragraph_01',
      content: [{ type: 'artificial_silence', length: 1 }],
    },
    {
      speaker: 'paragraph_02',
      content: [
        { type: 'artificial_silence', length: 1 },
        { type: 'artificial_silence', length: 1 },
        { type: 'artificial_silence', length: 1 },
      ],
    },
    {
      speaker: 'paragraph_01',
      content: [
        { type: 'artificial_silence', length: 1 },
        { type: 'artificial_silence', length: 1 },
      ],
    },
    {
      speaker: 'paragraph_02',
      content: [
        { type: 'artificial_silence', length: 1 },
        { type: 'artificial_silence', length: 1 },
        { type: 'artificial_silence', length: 1 },
      ],
    },
  ]);
});
