# AGENTS.md

Sloperator is a stdlib-only, tree-walking interpreter for SlopLang (`.slop`) on Python 3.13, managed with uv.

## Project layout

- `sloperator.py` — CLI entrypoint; there is no console script.
- `sloperator/` — interpreter package. `runner.py` wires the pipeline (`tokenize` -> `parse` -> `Interpreter`); `lexer/`, `parser/`, and `evaluator/` hold the stages; `errors.py` defines `SlopError` subclasses.
- `docs/spec.md` — authoritative language reference.
- `tests/` — pytest suite, including error diagnostics and auto-discovered examples.
- `examples/` — runnable `.slop` programs; `playground/` — local web playground.

## Validation

Run these four from the repo root, in order:

1. `uv run pytest`
2. `uv run ruff format --check`
3. `uv run ruff check`
4. `uv run ty check`

Use `uv run ruff format` to apply formatting. Run a single test with `uv run pytest tests/test_parser.py::test_name` or `-k pattern`. Run the comparison regression tests with `uv run pytest tests/test_comparisons.py`.

## Regression tests

Add a regression test whenever you fix a bug, change language behavior, or add a grammar rule. The test should fail before the change and pass after it.

- Prefer `run_source(source)` from `sloperator.runner` for language behavior; it captures stdout, stderr, and exit code without a subprocess.
- Put parser and precedence checks in `tests/test_parser.py` or `tests/test_precedence.py`.
- Update exact diagnostic expectations in `tests/test_errors.py` and `tests/test_cli.py` whenever an error message changes.
- Every `examples/*.slop` file is auto-tested by `tests/test_examples.py`; new examples must exit 0, print non-empty stdout, and write nothing to stderr.

## Language behavior

Do not infer SlopLang syntax or semantics from Python, and do not encode behavior that contradicts the spec. Change language behavior only against [docs/spec.md](docs/spec.md).
