import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getAiReferralSource } from '../src/lib/ai-referral';
test('AI referral recognition handles tagged links and real hosts without accepting lookalikes', () => {
  assert.equal(getAiReferralSource('https://mobilitystation.co.uk/guides?utm_source=chatgpt.com', ''), 'chatgpt');
  assert.equal(getAiReferralSource('https://mobilitystation.co.uk/', 'https://www.perplexity.ai/search/example'), 'perplexity');
  assert.equal(getAiReferralSource('https://mobilitystation.co.uk/', 'https://chatgpt.com.attacker.example/'), null);
  assert.equal(getAiReferralSource('https://mobilitystation.co.uk/', 'https://notchatgpt.com/'), null);
  assert.equal(getAiReferralSource('https://mobilitystation.co.uk/?utm_source=customer@example.com', ''), null);
  assert.equal(getAiReferralSource('https://mobilitystation.co.uk/', 'https://www.google.com/'), null);
});
