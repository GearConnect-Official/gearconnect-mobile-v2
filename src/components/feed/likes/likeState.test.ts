import { nextLikeState } from './likeState';

test('like : passe à liké et incrémente le compteur', () => {
  expect(nextLikeState(false, 3)).toEqual({ liked: true, count: 4 });
});

test('unlike : repasse à non-liké et décrémente le compteur', () => {
  expect(nextLikeState(true, 3)).toEqual({ liked: false, count: 2 });
});
