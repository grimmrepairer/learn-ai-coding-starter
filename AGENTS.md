# AGENTS.md

Sloperator is a stdlib-only, tree-walking interpreter for SlopLang (`.slop`) on Python 3.13, managed with uv. `docs/spec.md` is the authoritative language reference; `README.md` covers usage.

## Commands

Run everything from the repo root via `uv`:

- Validate, in order: `uv run pytest`, `uv run ruff format --check`, `uv run ruff check`, `uv run ty check`
- Format: `uv run ruff format`
- Single test: `uv run pytest tests/test_parser.py::test_name` (or `-k pattern`)
- Run a program: `uv run sloperator.py examples/fib.slop`
- Syntax check only: `uv run sloperator.py --check program.slop`
- Playground: `uv run playground/server.py [port]` (default 8080); each POST is logged to `logs/runs.log`.

There is no console-script entrypoint; always invoke `sloperator.py`. The `validate` skill runs pytest plus both ruff commands but omits `uv run ty check`; run it too. OpenCode config registers a `run_slop` tool (`.opencode/plugins/run-slop.ts`) that resolves paths from the project root; prefer it over shelling out when available.

## SlopLang source

Agents commonly emit Python-like syntax here; don't.

- Strings use `“ ”`, comments start with `—`, statements end with `✨`, booleans are `✅`/`❌`.
- ASCII `"`, `;`, `//`, and the en dash `–` are deliberate lexical errors.
- Conditions must be booleans (`vibe`, `ralph`, `&&`, `||`); there is no truthiness.
- `hallucinate(a, b, ...)` prints space-separated arguments and a newline; it returns nil.
- Copy non-ASCII tokens from existing examples/tests instead of retyping them.
- Change language behavior only against `docs/spec.md`, not assumptions from Python.

## Architecture

- Pipeline: `sloperator.py` -> `sloperator/runner.py` (`tokenize` -> `parse` -> `Interpreter`) -> `lexer/`, `parser/`, `evaluator/`.
- `runner.py` raises Python's recursion limit to 20,000; `interpreter.py` separately caps SlopLang call depth at 500. Tests monkeypatch the cap to exercise the Python fallback.
- AST nodes are frozen dataclasses in `parser/ast.py`, each exposing `.line` for diagnostics.
- Scoping and values live in `evaluator/environment.py` and `evaluator/values.py`.
- All language failures are `SlopError` subclasses in `sloperator/errors.py`, rendered as `SlopLang <kind> error at line N: message`. CLI contract: 0 success, 1 language error on stderr, 2 usage/file error; never leak a Python traceback for a language error.
- `--check` stops after parsing, so it cannot detect runtime errors.

## Testing

- `tests/test_examples.py` auto-discovers every `examples/*.slop`; each example must exit 0, write nothing to stderr, and print non-empty stdout.
- `tests/test_errors.py` asserts exact diagnostic strings; update expectations with any message change.
- Prefer `run_source(source)` from `sloperator.runner` for language tests; it captures stdout/stderr/exit code without a subprocess.

## Known spec deviations

Verified in the current code, but contradicting `docs/spec.md` and uncovered by tests. Fix the code and add regression tests rather than encoding current behavior:

- `ralph` executes its body once before checking the condition (do-while).
- `==`/`!=` bind tighter than `<`/`<=`/`>`/`>=`, the reverse of the documented precedence.

## Style

- Ruff: 100-column lines; lint rules `E,F,I,UP,B`.
- No runtime dependencies; stdlib only. Adding one requires updating `pyproject.toml` and `uv.lock`.
- Keep package `__init__.py` files as re-export shims.
