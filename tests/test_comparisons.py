from sloperator.runner import run_source


def test_comparison_binds_tighter_than_equality():
    result = run_source("hallucinate(1 < 2 == ✅)✨")

    assert (result.stdout, result.stderr, result.exit_code) == ("✅\n", "", 0)
