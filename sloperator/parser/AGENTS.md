# AGENTS.md — `sloperator/parser`

Recursive-descent parser: `parse(tokens) -> Program` in `parser.py` is the only public entry. The grammar in `docs/spec.md` is authoritative; do not infer syntax from Python or from the current code where the two disagree.

## Grammar rules map to methods

- Use one method per grammar rule. Each production in the spec's grammar is implemented by its own `Parser` method (snake_case, usually named after the rule: `function_decl`, `var_decl`, `logic_or`, `term`, `primary`, ...).
- Call the child rule's method from the parent; never inline a production into its caller.
- Group statement methods before expression methods. Helpers are fine (e.g. `factor_tail`, `terminator`), but they must not take over a production that should have its own method.
- When the spec gains a rule, add its method and a test; do not patch an existing method to special-case it.

## Syntax errors name the offending token

- Every `SlopSyntaxError` must say what was found. Build it through `self.error(token, message)` or `self.expect(...)`, which append `, found '<lexeme>'` — or `, but reached end of file` at EOF.
- Phrase the message as what was expected (`expected '}' to close block`); `error()` supplies the found-token half. Do not include the found token in the message yourself.
- Never raise `SlopSyntaxError` directly with only an expectation, and do not report a location without the token text. For semantic checks (duplicate parameters, `ship` outside a clanker), still anchor the error to the token that caused it.
- `tests/test_errors.py` and `tests/test_cli.py` assert exact diagnostic strings; update them with any message change.

## Conventions

- AST nodes are frozen dataclasses from `parser/ast.py`; construct them directly and pass the source `Token` for anything that needs a line number.
- Use `match`/`check`/`advance`/`peek`/`peek_next`/`previous` and `expect` for token handling; do not index `self.tokens` ad hoc.
- `Parser.current` indexes the token list, and the list always ends with `EOF`; `advance()` must never step past it.
