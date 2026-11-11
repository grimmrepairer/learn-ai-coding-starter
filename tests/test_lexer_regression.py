import pytest

from sloperator.errors import LexicalError
from sloperator.lexer import tokenize


@pytest.mark.parametrize(
    ("source", "line", "message"),
    [
        ("@", 1, "unexpected character '@'"),
        ("slop x = 1@✨", 1, "unexpected character '@'"),
        ("slop x = 1✨\n#", 2, "unexpected character '#'"),
    ],
)
def test_unexpected_character_is_a_lexical_error(source: str, line: int, message: str):
    with pytest.raises(LexicalError) as info:
        tokenize(source)
    assert info.value.line == line
    assert info.value.message == message
    assert str(info.value) == f"SlopLang lexical error at line {line}: {message}"
