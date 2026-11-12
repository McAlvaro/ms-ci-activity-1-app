# Actividad: calidad de código en el editor y hooks de Git

Proyecto `ms-ci-activity-1-app` (React + TypeScript + Vite). Editor: Neovim 0.11.

```bash
npm install   # instala dependencias y activa los hooks mediante `prepare`
```

## Resumen

| Requisito                              | Solución                                                                | Archivos                                                                                            |
| -------------------------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| 1. SonarLint y linter en el editor     | ESLint (flat config) como LSP en Neovim; SonarLint con `sonarlint.nvim` | `eslint.config.js`, fragmentos Lua de este README                                                   |
| 2. `.editorconfig` / config del linter | `.editorconfig` en la raíz (Neovim lo lee de forma nativa)              | `.editorconfig`, `eslint.config.js`                                                                 |
| 3. Regla de tabuladores                | `@stylistic/indent: ['error', 'tab']`                                   | `eslint.config.js`, `package.json`                                                                  |
| 4. Hooks de Git                        | Husky + lint-staged (`prettier --write` + `eslint --fix`) + commitlint  | `.husky/pre-commit`, `.husky/commit-msg`, `.husky/pre-push`, `commitlint.config.js`, `package.json` |

## 1. Linter y SonarLint

- ESLint: `eslint.config.js`, ejecutado con `npm run lint` y como servidor `eslint` en Neovim.
- SonarLint: `sonarlint.nvim` en modo standalone (sin SonarQube/SonarCloud); sin dependencias en el proyecto.

## 2. `.editorconfig`

- Todos los archivos: `charset = utf-8`, `end_of_line = lf`, `insert_final_newline = true`, `trim_trailing_whitespace = true`.
- Indentación: `indent_style = tab`, `indent_size = tab`, `tab_width = 2`.
- `json`, `jsonc`, `yml`, `yaml`, `md`: 2 espacios.
- `*.md`: `trim_trailing_whitespace = false`.

## 3. Regla de tabuladores y formato

Formato con Prettier (`.prettierrc.json`: tabuladores, sin punto y coma, comillas simples, 100 columnas; `json`/`md`/`yaml` con 2 espacios). No se usa `eslint-config-prettier` para mantener activa la regla de tabuladores de ESLint.

En `eslint.config.js` con `@stylistic/eslint-plugin`:

- `@stylistic/indent: ['error', 'tab']`
- `@stylistic/jsx-indent-props: ['error', 'tab']`
- `@stylistic/no-mixed-spaces-and-tabs: 'error'`

Scripts de `package.json`:

- `npm run lint`: ESLint.
- `npm run lint:fix`: `eslint . --fix`.
- `npm run format`: `prettier --write .` (todo el proyecto).
- `npm run format:check`: `prettier --check .`.
- `npm run check`: lint + format:check + typecheck + test + build.

## 4. Hooks (Husky + lint-staged)

| Hook         | Comando                              | Acción                                                                                                                                                                                                                  |
| ------------ | ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pre-commit` | `npx lint-staged`                    | Sobre archivos staged: `prettier --write` y luego `eslint --fix` en `js/ts/tsx`; `prettier --write` en `json/css`. Corrige y re-agrega los archivos al commit. Bloquea solo si quedan errores sin corrección automática |
| `commit-msg` | `npx --no -- commitlint --edit "$1"` | Conventional Commits: `tipo(scope): resumen`, scope obligatorio. Ejemplo: `feat(contacts): add search`                                                                                                                  |
| `pre-push`   | `npm run test`                       | Pruebas unitarias                                                                                                                                                                                                       |

- `prepare`: `husky` (instala los hooks en `npm install`).
- `commitlint.config.js`: `@commitlint/config-conventional` + `scope-empty` obligatorio.

Demostración del mensaje de commit:

```bash
echo "bad message" | npx commitlint                  # -> código 1 (rechazado)
echo "feat(hooks): add commitlint" | npx commitlint  # -> código 0
```

Demostración de la corrección automática de indentación:

```bash
printf 'export function demo() {\n  return 1\n}\n' > src/demo.ts
git add src/demo.ts
npx lint-staged   # -> código 0; src/demo.ts queda con tabuladores y sigue staged
git restore --staged src/demo.ts
rm src/demo.ts
```

## Configuración de Neovim

Fragmentos para `lazy.nvim`, Neovim 0.11+.

### a) EditorConfig (integrado)

Sin instalación. Comprobación: `:verbose set noexpandtab? tabstop? shiftwidth?` en un `.tsx`.

### b) ESLint (servidor de lenguaje)

Paquete de Mason `eslint-lsp` (lspconfig: `eslint`):

```lua
-- lua/plugins/eslint.lua
return {
	{
		"neovim/nvim-lspconfig",
		dependencies = { "mason-org/mason.nvim", "mason-org/mason-lspconfig.nvim" },
		config = function()
			require("mason").setup()
			require("mason-lspconfig").setup({ ensure_installed = { "eslint" } })

			vim.lsp.config("eslint", {
				-- Usa eslint.config.js (flat config) desde la raíz del proyecto.
				on_attach = function(_, bufnr)
					-- Corrige al guardar todos los problemas corregibles automáticamente.
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

### c) Formato al guardar (Prettier)

Con `conform.nvim` y `prettierd`/`prettier`, el formato usa el `.prettierrc.json` del proyecto; es consistente con `npm run format` y el `pre-commit`.

### d) SonarLint

Nota: la URL de `sonarlint.nvim`, el paquete `sonarlint-language-server` y la ruta del `.jar` NO están verificados.

```lua
-- lua/plugins/sonarlint.lua
return {
	"schrieveslaach/sonarlint.nvim",
	url = "https://gitlab.com/schrieveslaach/sonarlint.nvim",
	dependencies = { "mason-org/mason.nvim", "neovim/nvim-lspconfig" },
	ft = { "typescript", "typescriptreact", "javascript" },
	config = function()
		require("sonarlint").setup({
			server = {
				cmd = {
					"sonarlint-language-server",
					-- Asegura que sonarlint-language-server use el canal stdio
					"-stdio",
					"-analyzers",
					-- Archivos jar de analizadores instalados por el paquete de Mason.
					vim.fn.expand("$MASON/share/sonarlint-analyzers/sonarjs.jar"),
				},
			},
			filetypes = { "typescript", "typescriptreact", "javascript" },
		})
	end,
}
```

Instalación: `:MasonInstall sonarlint-language-server`.

## Verificación

```bash
npm run lint
npm run check   # lint + format:check + typecheck + test + build (manual)
echo "feat(hooks): add commitlint" | npx commitlint
git config core.hooksPath  # .husky/_
```
