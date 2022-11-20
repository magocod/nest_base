import { Cat, OwnerDocument, StoryDocument } from '../entities';

export class CatAggregateResult extends Cat {
  ownerData: OwnerDocument;
  stories: StoryDocument[];
}
