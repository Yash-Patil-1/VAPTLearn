"""Tests for streak & XP logic."""

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

import pytest
from services.stats import award_xp, get_streak, XP_QUIZ_CORRECT, XP_LESSON_COMPLETE
from models.database import init_db, get_connection


@pytest.fixture(autouse=True)
def setup_db():
    """Ensure clean tables before each test."""
    import asyncio
    asyncio.run(init_db())
    conn = get_connection()
    conn.execute("DELETE FROM user_stats")
    conn.execute("DELETE FROM daily_activity")
    conn.execute("INSERT INTO user_stats (id) VALUES (1)")
    conn.commit()
    conn.close()


def set_last_active(date_str: str):
    """Set last_active_date directly in DB to simulate previous activity."""
    conn = get_connection()
    conn.execute(
        "UPDATE user_stats SET current_streak=?, longest_streak=?, last_active_date=? WHERE id=1",
        (1, 1, date_str),
    )
    conn.commit()
    conn.close()


class TestStreakMath:
    def test_first_award_starts_streak_at_1(self):
        """First ever award sets streak to 1."""
        result = award_xp(5, "quiz")
        assert result["current_streak"] == 1
        assert result["longest_streak"] == 1
        assert result["total_xp"] == 5

    def test_same_day_no_bump(self):
        """Awarding XP twice on the same day doesn't increase streak more than once."""
        award_xp(5, "quiz")
        award_xp(5, "quiz")
        result = award_xp(5, "quiz")
        # last_active is today, so current_streak stays at 1 (no consecutive-day bump)
        assert result["current_streak"] == 1
        assert result["total_xp"] == 15

    def test_total_xp_accumulates(self):
        """Total XP accumulates across awards."""
        award_xp(5, "quiz")
        award_xp(5, "quiz")
        award_xp(5, "quiz")
        result = get_streak()
        assert result["total_xp"] == 15
        assert result["today_xp"] == 15

    def test_daily_goal_not_met(self):
        """Daily goal (50) not met with just 5 XP."""
        award_xp(5, "quiz")
        result = get_streak()
        assert result["today_xp"] == 5
        assert not result["goal_met"]

    def test_daily_goal_met(self):
        """Daily goal is met when XP >= 50."""
        for _ in range(10):
            award_xp(5, "quiz")
        result = get_streak()
        assert result["today_xp"] >= 50
        assert result["goal_met"]

    def test_last_7_days_count(self):
        """get_streak returns 7 days of activity."""
        streak_data = get_streak()
        assert len(streak_data["last_7_days"]) == 7

    def test_lesson_xp(self):
        """Award lesson XP."""
        result = award_xp(XP_LESSON_COMPLETE, "lesson")
        assert result["total_xp"] == XP_LESSON_COMPLETE

    def test_quiz_xp(self):
        """Award quiz XP."""
        result = award_xp(XP_QUIZ_CORRECT, "quiz")
        assert result["total_xp"] == XP_QUIZ_CORRECT

    def test_longest_streak_tracking(self):
        """Longest streak tracks across dates."""
        from datetime import date, timedelta
        yesterday = (date.today() - timedelta(days=1)).isoformat()
        # Simulate yesterday with streak=2
        conn = get_connection()
        conn.execute(
            "UPDATE user_stats SET current_streak=2, longest_streak=2, last_active_date=? WHERE id=1",
            (yesterday,)
        )
        conn.commit()
        conn.close()

        # Award today — should bump streak to 3 since yesterday was consecutive
        result = award_xp(5, "quiz")
        assert result["current_streak"] == 3
        assert result["longest_streak"] == 3

    def test_gap_resets_streak(self):
        """Gap resets streak to 1."""
        from datetime import date, timedelta
        two_days_ago = (date.today() - timedelta(days=2)).isoformat()
        # Simulate last active 2 days ago
        conn = get_connection()
        conn.execute(
            "UPDATE user_stats SET current_streak=5, longest_streak=5, last_active_date=? WHERE id=1",
            (two_days_ago,)
        )
        conn.commit()
        conn.close()

        # Award today — gap means streak resets to 1
        result = award_xp(5, "quiz")
        assert result["current_streak"] == 1  # reset
        assert result["longest_streak"] == 5  # preserved
