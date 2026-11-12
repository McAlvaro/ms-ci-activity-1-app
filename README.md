# Contacts App

Single-page contacts manager built with React, TypeScript, Vite, Tailwind CSS v4 and shadcn/ui.
Features: list, case-insensitive search (name, email, phone), add, edit, delete with confirmation,
and persistence in `localStorage`.

## Setup

```bash
npm install
```

## Run

```bash
npm run dev      # start the dev server
npm run build    # type-check and build for production
npm run preview  # preview the production build
```

## Test and quality checks

```bash
npm run test       # unit and component tests (Vitest + Testing Library)
npm run lint       # ESLint
npm run typecheck  # TypeScript
npm run check      # lint + typecheck + test + build
```

## Code style and Git hooks

### Indentation

The project is indented with **tabs** (display width 2). The rule lives in two places:

- `.editorconfig` tells editors to use tabs for source files (JSON, YAML and Markdown use 2 spaces).
- `@stylistic/eslint-plugin` enforces it in ESLint (`@stylistic/indent`, `@stylistic/jsx-indent-props`,
  `@stylistic/no-mixed-spaces-and-tabs`). This includes the generated `src/components/ui` files, which
  are otherwise excluded from the quality rules.

```bash
npm run format    # fix layout (indentation) problems only
npm run lint:fix  # apply every auto-fixable ESLint problem
```

### Git hooks (Husky)

Hooks are installed automatically by `npm install` (the `prepare` script).

| Hook         | Command                                      | What it does                                                          |
| ------------ | -------------------------------------------- | --------------------------------------------------------------------- |
| `pre-commit` | `npx lint-staged`                            | Runs ESLint with `--max-warnings=0` on staged `js/ts/tsx` files. It only rejects; it never rewrites your files. |
| `pre-push`   | `npm run check`                              | Runs lint, typecheck, tests and build before anything is pushed.      |

If a commit is rejected, run `npm run format` (or `npm run lint:fix`), review the changes, stage them and commit again.

**Do not use `--no-verify`.** Fix the reported problem instead of skipping the hooks.

### Neovim setup

The snippets below are for your own Neovim configuration; nothing here is applied by the repository.
They are written for `lazy.nvim` and Neovim 0.11+.

#### 1. EditorConfig (built in)

Neovim 0.9+ reads `.editorconfig` natively, so no plugin is needed. Check it with `:verbose set noexpandtab? tabstop? shiftwidth?`
in a `.tsx` file.

Warning: if you have a formatter on save (for example `conform.nvim` with `prettier`/`prettierd`) it will
rewrite the code with spaces and fight against the tab rule. For this project either skip Prettier for
JS/TS or run `:LspEslintFixAll` after formatting, and prefer `npm run format`.

#### 2. ESLint (language server)

Install the server with Mason (package `eslint-lsp`, lspconfig name `eslint`) and enable it:

```lua
-- lua/plugins/eslint.lua
return {
	{
		"neovim/nvim-lspconfig",
		dependencies = { "williamboman/mason.nvim", "williamboman/mason-lspconfig.nvim" },
		config = function()
			require("mason").setup()
			require("mason-lspconfig").setup({ ensure_installed = { "eslint" } })

			vim.lsp.config("eslint", {
				-- Uses eslint.config.js (flat config) from the project root.
				on_attach = function(_, bufnr)
					-- Fix all auto-fixable problems on save.
					vim.api.nvim_create_autocmd("BufWritePre", {
						buffer = bufnr,
						command = "LspEslintFixAll",
					})
				end,
			})
			vim.lsp.enable("eslint")
		end,
	},
}
```

Alternative with `nvim-lint` (diagnostics only, runs the local `eslint` binary):

```lua
require("lint").linters_by_ft = {
	javascript = { "eslint" },
	typescript = { "eslint" },
	typescriptreact = { "eslint" },
}
```

#### 3. SonarLint

```lua
-- lua/plugins/sonarlint.lua
return {
	"schrieveslaach/sonarlint.nvim",
	url = "https://gitlab.com/schrieveslaach/sonarlint.nvim",
	dependencies = { "williamboman/mason.nvim", "neovim/nvim-lspconfig" },
	ft = { "typescript", "typescriptreact", "javascript" },
	config = function()
		require("sonarlint").setup({
			server = {
				cmd = {
					"sonarlint-language-server",
					-- Ensure that sonarlint-language-server uses stdio channel
					"-stdio",
					"-analyzers",
					-- Analyzer jars installed by the Mason package.
					vim.fn.expand("$MASON/share/sonarlint-analyzers/sonarjs.jar"),
				},
			},
			filetypes = { "typescript", "typescriptreact", "javascript" },
		})
	end,
}
```

Install the server with `:MasonInstall sonarlint-language-server`. It runs in standalone mode (no SonarQube/SonarCloud
connection), so no `connected` configuration is needed.
