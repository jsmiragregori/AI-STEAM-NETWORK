# Third-party notices

The browser runtime is self-contained. These third-party assets are committed to
the repository and no CDN request is made when the site is rendered.

| Component | Version/source | License | Local files |
|---|---|---|---|
| Lucide | `lucide@1.24.0` | ISC; icons derived from Feather under MIT | `assets/js/lib/lucide.min.js`, `assets/js/lib/lucide-LICENSE.txt` |
| wordcloud2.js | `wordcloud@1.2.3` plus local `rotateRatio` callback patch (`44edcb5`) | MIT | `assets/js/lib/wordcloud2.js`, `assets/js/lib/wordcloud2-LICENSE.txt` |
| Instrument Sans | v4, Google Fonts distribution | SIL Open Font License 1.1 | `assets/fonts/instrument-sans/` |
| Country flags | Flagcdn snapshots retrieved 2026-07-15 | See per-source conditions and `assets/flags/NOTICE.md` | `assets/flags/20x15/`, `assets/flags/48x36/` |

Exact source URLs, byte sizes and SHA-256 hashes are locked in
`assets/vendor-manifest.json`.

When generated Network data introduces a country, the runtime immediately uses
the local neutral fallback. To add its real flags to a reviewed release, run:

```bash
npm run vendor:flags -- --update-lock
npm run verify:vendor
```

The first command is the only mode that downloads or updates flag assets. Review
the PNG and manifest diff before committing it. Production never runs either a
download or a Node process.
