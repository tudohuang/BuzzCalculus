# Responsive workspace

The app shares one navigation and component system across desktop, tablet and
phone. Training, answer checking and stored record formats are unchanged.

- Desktop, 1200 CSS px and above: 232 px sidebar and a centred content area up
  to 1280 px. The dashboard and populated insights use multiple columns.
- Tablet, 768–1199 CSS px: 88 px rail with labelled navigation. iPad portrait
  uses a single dashboard column; wider landscape layouts use two columns.
- Phone and narrow Split View: header and five bottom navigation items, with
  safe-area spacing. Landscape phones up to 960 px use the same shell.
- During a lesson, navigation gives way to the existing focused quiz header.
  Handwriting remains available inline and in full screen.

The home overview and seven-day activity strip use saved records; a new user
sees real zero states. The library starts with search and filters, with optional
training suggestions in a disclosure. Settings have native section jump links.
All main views expose the shared `buzz-main` skip-link target.

Styles are in the workspace section at the end of `styles.css`; its screen media
queries preserve the existing print stylesheet. Both themes use the same layout.
The manifest permits portrait and landscape, and the service-worker cache was
updated so installed clients can receive the redesigned shell.

## Verification

Run `node tools/e2e_responsive_workspace.js` for 93 page states across nine viewport
sizes, populated charts and lists, search, dark mode, settings links and launching
a lesson. Add `--screenshots` to save previews under `tmp/workspace-review/`.
The suite uses an isolated Chrome profile; its populated records are test data.

Additional regression checks: `tools/e2e_main_flow.js`, `tools/e2e_mobile.js`,
`tools/e2e_layout.js`, `tools/e2e_handwriting.js`, `tools/smoke_app_render.js`,
`tools/validate_app_shell.js`, `tools/validate_offline_assets.js`,
`tools/validate_performance_budget.js`, and `tools/validate_version.js`.

Chrome viewport and touch emulation validate layout and application behaviour.
Native Safari keyboard behaviour and physical Apple Pencil hardware still need
device testing.
