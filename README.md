# Sloperator

A tree-walking interpreter for [SlopLang](docs/spec.md), written in Python.

See the [language specification](docs/spec.md) for syntax, values, scoping, operators, and errors.

## Validation

```bash
uv run pytest
uv run ruff format --check
uv run ruff check
uv run ty check
```

## Usage

```bash
uv run sloperator.py path/to/program.slop  # run
uv run sloperator.py --check program.slop  # syntax check only
uv run sloperator.py examples/fib.slop
```

## Layout

- `sloperator.py` — CLI entrypoint
- `sloperator/lexer/`, `parser/`, `evaluator/` — tokenizer, AST, interpreter
- `sloperator/runner.py` — runs source through all stages
- `docs/spec.md` — language specification
- `examples/`, `tests/` — example programs and test suite
- `playground/` — `uv run playground/server.py`, then open <http://localhost:8080>
