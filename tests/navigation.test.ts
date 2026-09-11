import { test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Header } from '../src/components/Header';
import { Footer } from '../src/components/Footer';

test('popup header and footer cannot open a new tab while bookmark saving is active', () => {
  for (const component of [Header, Footer]) {
    const normal = renderToStaticMarkup(React.createElement(component));
    assert.match(normal, /href="https:/);
    const saving = renderToStaticMarkup(React.createElement(component, { disabled: true }));
    assert.doesNotMatch(saving, /href=/);
    assert.match(saving, /aria-disabled="true"/);
    assert.match(saving, /tabindex="-1"/);
  }
});
