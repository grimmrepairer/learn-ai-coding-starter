from sloperator.runner import run_source


def test_call_used_directly_as_an_argument_to_another_call():
    source = """clanker double(n) {
    ship n * 2✨
}
clanker add(a, b) {
    ship a + b✨
}
hallucinate(add(double(3), double(4)))✨
"""
    result = run_source(source)

    assert result.stdout == "14\n"
    assert result.stderr == ""
    assert result.exit_code == 0
