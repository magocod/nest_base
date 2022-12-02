import { Cat, OwnerDocument, StoryDocument } from '../entities';

export interface CatAggregateResult extends Cat {
  ownerData: OwnerDocument;
  stories: StoryDocument[];
}
