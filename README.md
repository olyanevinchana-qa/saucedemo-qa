# SauceDemo UI automation

UI test automation for [SauceDemo](https://www.saucedemo.com), built with
[Playwright Test](https://playwright.dev) and TypeScript. The suite covers four
business scenarios and runs them in Chromium, Firefox, and WebKit.

## What is tested

| Scenario | Spec file | What it verifies |
| --- | --- | --- |
| Valid login | `tests/valid-login.spec.ts` | Logging in with the standard demo user opens the inventory page with the Products title and at least one product. |
| Add a product to the cart | `tests/cart.spec.ts` | The added product shows in the cart with the expected name, price, quantity, and description. |
| Complete checkout | `tests/checkout.spec.ts` | A full purchase reaches the confirmation page, with the expected order totals and messages. |
| Invalid login | `tests/invalid-login.spec.ts` | Wrong credentials show the expected error message, stay on the login page, and do not show the inventory. |

Each scenario runs in its own fresh browser context and logs in through the UI.
Tests do not depend on each other or on saved sessions, so every test can be run
alone. Four scenarios across three browsers give twelve test runs.

## Prerequisites

- Node.js 24.22.0 (see `.nvmrc`). With nvm, run `nvm install && nvm use`.
- npm (bundled with Node.js).
- Internet access to `https://www.saucedemo.com`.

Playwright downloads its own Chromium, Firefox, and WebKit builds. No system
browsers are needed.

## Setup

```sh
npm ci
npx playwright install chromium firefox webkit
cp .env.example .env
```

On Linux, install the browsers together with their system libraries instead:

```sh
npx playwright install --with-deps chromium firefox webkit
```

Then open `.env` and fill `LOGIN_USERNAME` and `LOGIN_PASSWORD` with the public
demo account that SauceDemo lists on its [login page](https://www.saucedemo.com/).

## Running the tests

```sh
npm test                                            # all tests, all browsers
npx playwright test tests/cart.spec.ts              # one spec file
npx playwright test --project=firefox               # one browser
npx playwright test tests/cart.spec.ts --project=webkit
npx playwright test --list                          # list tests without running
npm run typecheck                                   # TypeScript check, no output files
```

Tests run headless. Add `--headed` to watch a run, or `--repeat-each=3` to
repeat each test.

## Configuration

Settings are read from the shell environment or a root `.env` file. Shell
variables take precedence over `.env`.

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `BASE_URL` | No | `https://www.saucedemo.com` | Site under test. Must be an absolute HTTP or HTTPS URL. |
| `LOGIN_USERNAME` | Yes, for login-based tests | none | Demo account username. |
| `LOGIN_PASSWORD` | Yes, for login-based tests | none | Demo account password. |

Missing or blank credentials fail with a clear message that names the variable.
Credentials are never hardcoded or logged, and `.env` is ignored by Git. The
invalid-login scenario uses fixed, deliberately wrong values and needs no
credentials.

The Playwright configuration in `playwright.config.ts` defines the three browser
projects, headless execution, no retries, the HTML report, and screenshots on
failure.

## Reports and failure screenshots

Every run writes an HTML report to `playwright-report/`. A screenshot is captured
for each failed test and attached to the report. Raw artifacts are kept in
`test-results/`.

```sh
npm run report
```

This opens the last report in your browser. Both folders are generated output
and are ignored by Git.

## Project structure

```text
.
├── .github/workflows/playwright.yml   CI workflow
├── src/
│   ├── data/                          Test data, separate from test logic
│   │   ├── credentials.ts             Reads login credentials from the environment
│   │   ├── invalid-credentials.ts     Wrong credentials and the expected error
│   │   ├── products.ts                Product used in the cart and checkout tests
│   │   ├── customer.ts                Checkout customer details
│   │   ├── order-totals.ts            Expected order totals
│   │   └── page-text.ts               Expected page titles and confirmation messages
│   └── pages/                         Page objects
│       ├── login.page.ts
│       ├── inventory.page.ts
│       ├── cart.page.ts
│       ├── checkout.page.ts
│       └── page-title.ts              Page-title locator shared by the page objects
├── tests/                             One spec file per scenario
├── playwright.config.ts               Runner, browsers, reporters, environment loading
├── .env.example                       Template for local configuration
└── package.json
```

## Design

- **Page Object Model.** Locators and page actions live in `src/pages/`. Tests
  describe the scenario and its assertions and call page objects for the steps.
- **Test data separated from logic.** Users, products, customer details, totals,
  and expected texts are typed modules in `src/data/`.
- **Reuse without extra layers.** Shared behavior lives in the page objects, the
  data modules, and the shared page-title locator. Tests deliberately log in through
  the UI each time, so each one is independent.
- **Stable waiting.** Tests use Playwright's retrying assertions. There are no
  fixed sleeps, and retries are off so failures are never hidden.
- **Configurable base URL.** `BASE_URL` selects the target site without code changes.

## Continuous integration

`.github/workflows/playwright.yml` runs on every pull request to `main` and can be
started manually from the Actions tab. On `ubuntu-latest` it installs Node.js from
`.nvmrc`, runs `npm ci`, type-checks, installs the three browsers with their system
dependencies, and runs the full suite.

Set these repository secrets under Settings → Secrets and variables → Actions:

- `LOGIN_USERNAME`
- `LOGIN_PASSWORD`

The `playwright-report` artifact, and `test-results` when it has files such as failure
screenshots, are uploaded after every run, including failed ones, and kept for 14
days. Download them from the run's page and open `index.html` from the report.

## Supported environments

| Environment | Status |
| --- | --- |
| macOS, Chromium / Firefox / WebKit | Run locally. |
| Linux (`ubuntu-latest`), Chromium / Firefox / WebKit | Run in GitHub Actions. |

## Future improvements

The following are not implemented in this version. They are possible next steps:

- **More users and login validation.** Other demo users (for example the locked-out
  user) and further invalid-login cases such as empty fields.
- **More products and cart behavior.** Additional products, carts with several
  items, removing items, and the empty-cart state.
- **Checkout validation.** Required-field errors on the customer form, cancelling a
  checkout, and a broader check of the order totals.
- **API and UI comparison.** Comparing data from a public API with what the UI shows.
  The API, the matching UI, and the data mapping still need to be chosen.

## Assumptions and limitations

- The tests use the live public site, so they need network access and can be
  affected by the site being slow or unavailable.
- Credentials are the public demo account from the SauceDemo login page, supplied
  through the environment.
- Expected values (product price and description, order totals, page titles, and
  messages) match the site's current content. If SauceDemo changes them, update
  `src/data/`.
- Each checkout run places a throwaway order on the demo site. SauceDemo stores
  nothing, takes no payment, and ships nothing.
- Runs are not retried, so one failure is reported as a failure.
- Scenarios cover one user, one product, and one invalid credential combination.
