import { Paragraph } from '../../core/document';

export function chainContentMergeParagraphsIfEqualSpeaker(
  a: Paragraph[],
  b: Paragraph[]
): Paragraph[] {
  if (a.length == 0) return b;
  if (b.length == 0) return a;

  const aLastParagraph = a[a.length - 1];
  if (b[0].speaker == aLastParagraph.speaker) {
    return [
      ...a.slice(0, -1),
      {
        speaker: aLastParagraph.speaker,
        content: [...aLastParagraph.content, ...b[0].content],
      },
      ...b.slice(1),
    ];
  } else {
    return [...a, ...b];
  }
}
