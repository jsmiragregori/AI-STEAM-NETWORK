import assert from 'node:assert/strict';
import test from 'node:test';

import { resolveMembershipAction } from '../../assets/js/utils/membership.js';

const microsoftForms = (url, presentation = 'newTab') => ({
  formVisible: true,
  formMode: 'microsoftForms',
  microsoftForms: { url, presentation },
});

test('resolveMembershipAction devuelve la URL cuando supera la allowlist', () => {
  assert.deepEqual(
    resolveMembershipAction(microsoftForms('https://forms.office.com/r/abc'), 'home'),
    { kind: 'external', url: 'https://forms.office.com/r/abc' },
  );
  assert.deepEqual(
    resolveMembershipAction(microsoftForms('https://forms.office.com/r/abc', 'embed'), 'network'),
    { kind: 'embed', url: 'https://forms.office.com/r/abc' },
  );
});

test('resolveMembershipAction falla cerrado: una URL rechazada no llega a href ni a iframe', () => {
  for (const hostile of ['javascript:alert(1)', 'data:text/html,<script>', '//evil.example/forms']) {
    for (const presentation of ['newTab', 'embed']) {
      for (const context of ['home', 'network', 'sectors']) {
        const action = resolveMembershipAction(microsoftForms(hostile, presentation), context);
        assert.equal(action.kind, 'unsafe', `${hostile} / ${presentation} / ${context}`);
        assert.equal(action.url, undefined, 'la acción insegura no transporta URL');
      }
    }
  }
});

test('resolveMembershipAction conserva los estados que no dependen de la URL', () => {
  assert.deepEqual(resolveMembershipAction({ formVisible: false }), { kind: 'hidden' });
  assert.deepEqual(resolveMembershipAction({ formMode: 'demo' }), { kind: 'internal' });
  assert.deepEqual(resolveMembershipAction(microsoftForms('')), { kind: 'hidden' });
});
