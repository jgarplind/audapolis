import { Paragraph } from '../../core/document';
import { chainContentMergeParagraphsIfEqualSpeaker } from './edit_util';

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

test('chainContentMergeParagraphsIfEqualSpeaker both empty', () => {
  expect(chainContentMergeParagraphsIfEqualSpeaker([], [])).toEqual([]);
});
test('chainContentMergeParagraphsIfEqualSpeaker one emtpy', () => {
  expect(chainContentMergeParagraphsIfEqualSpeaker([], testContent)).toEqual(testContent);
});
test('chainContentMergeParagraphsIfEqualSpeaker no-merge', () => {
  expect(chainContentMergeParagraphsIfEqualSpeaker(testContent, testContent)).toEqual([
    ...testContent,
    ...testContent,
  ]);
});
test('chainContentMergeParagraphsIfEqualSpeaker merge', () => {
  expect(
    chainContentMergeParagraphsIfEqualSpeaker(testContent, [
      {
        speaker: 'paragraph_02',
        content: [
          { type: 'artificial_silence', length: 1 },
          { type: 'artificial_silence', length: 1 },
          { type: 'artificial_silence', length: 1 },
        ],
      },
    ])
  ).toEqual([
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
        { type: 'artificial_silence', length: 1 },
        { type: 'artificial_silence', length: 1 },
        { type: 'artificial_silence', length: 1 },
      ],
    },
  ]);
});
