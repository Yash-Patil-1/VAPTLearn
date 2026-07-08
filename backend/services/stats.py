"""
Streak & XP service — single-user, local-date based.
Awards XP, maintains streak, and records daily activity.

# ponytail: local-date streak, single-user. If multi-device sync is ever needed, move to UTC + server clock.
"""

from datetime import date, timedelta
from models.database import get_connection

# XP values (named constants, tune later)
XP_SECTION_CHECKPOINT = 5   # Lesson section checkpoint answered correctly
XP_LESSON_COMPLETE = 15     # Lesson completed (all checkpoints done)
XP_QUIZ_CORRECT = 5         # Quiz question correct
DAILY_GOAL_XP = 50          # Daily goal — the flame lights when met

# Level thresholds (total XP needed to reach each level)
LEVEL_THRESHOLDS = [0, 50, 120, 220, 360, 550, 800, 1100, 1500, 2000]


def calculate_level(total_xp: int) -> dict:
    """
    Derive level from total XP. Pure function — no DB writes.
    Returns {"level", "level_xp", "next_level_xp", "max_level_reached"}.
    Max level is 10 (index 9 in LEVEL_THRESHOLDS).
    """
    max_level = len(LEVEL_THRESHOLDS)  # 10
    level = 1
    for i, threshold in enumerate(LEVEL_THRESHOLDS):
        if total_xp >= threshold:
            level = i + 1

    if level >= max_level:
        # Max level — show as complete
        level = max_level
        current_threshold = LEVEL_THRESHOLDS[-1]
        next_threshold = current_threshold
        level_xp = 0
        next_level_xp = 1
    else:
        current_threshold = LEVEL_THRESHOLDS[level - 1]
        next_threshold = LEVEL_THRESHOLDS[level]
        level_xp = total_xp - current_threshold
        next_level_xp = next_threshold - current_threshold

    return {
        "level": level,
        "level_xp": level_xp,
        "next_level_xp": next_level_xp,
        "max_level_reached": level >= max_level,
    }


def award_xp(amount: int, kind: str) -> dict:
    """
    Award XP and update streak. Called on every XP-awarding event.

    kind is either "lesson" or "quiz" — used to increment daily_activity counters.
    Returns the updated user_stats dict.
    """
    today = date.today().isoformat()
    yesterday = (date.today() - timedelta(days=1)).isoformat()

    conn = get_connection()
    row = conn.execute("SELECT * FROM user_stats WHERE id = 1").fetchone()

    total_xp = row["total_xp"] + amount
    current_streak = row["current_streak"]
    longest_streak = row["longest_streak"]
    last_active = row["last_active_date"]

    if last_active == today:
        # Already counted today, streak unchanged
        pass
    elif last_active == yesterday:
        # Consecutive day
        current_streak += 1
    else:
        # Missed a day (or first ever) — reset to 1
        current_streak = 1

    longest_streak = max(longest_streak, current_streak)

    conn.execute(
        "UPDATE user_stats SET total_xp=?, current_streak=?, longest_streak=?, last_active_date=? WHERE id=1",
        (total_xp, current_streak, longest_streak, today),
    )

    # Upsert daily_activity
    existing = conn.execute("SELECT * FROM daily_activity WHERE date = ?", (today,)).fetchone()
    if existing:
        conn.execute(
            "UPDATE daily_activity SET xp = xp + ?, lessons = lessons + ?, quizzes = quizzes + ? WHERE date = ?",
            (amount, 1 if kind == "lesson" else 0, 1 if kind == "quiz" else 0, today),
        )
    else:
        conn.execute(
            "INSERT INTO daily_activity (date, xp, lessons, quizzes) VALUES (?, ?, ?, ?)",
            (today, amount, 1 if kind == "lesson" else 0, 1 if kind == "quiz" else 0),
        )

    conn.commit()
    conn.close()

    level_info = calculate_level(total_xp)

    return {
        "total_xp": total_xp,
        "current_streak": current_streak,
        "longest_streak": longest_streak,
        "last_active_date": today,
        **level_info,
    }


def get_streak() -> dict:
    """Get current streak + XP stats with last 7 days of activity."""
    conn = get_connection()
    stats = conn.execute("SELECT * FROM user_stats WHERE id = 1").fetchone()
    today = date.today().isoformat()
    today_row = conn.execute("SELECT * FROM daily_activity WHERE date = ?", (today,)).fetchone()
    today_xp = today_row["xp"] if today_row else 0
    goal_met = today_xp >= DAILY_GOAL_XP

    # Last 7 days (today + 6 before)
    last_7 = []
    for i in range(6, -1, -1):
        d = (date.today() - timedelta(days=i)).isoformat()
        row = conn.execute("SELECT * FROM daily_activity WHERE date = ?", (d,)).fetchone()
        last_7.append({
            "date": d,
            "xp": row["xp"] if row else 0,
        })

    conn.close()

    level_info = calculate_level(stats["total_xp"])

    return {
        "total_xp": stats["total_xp"],
        "current_streak": stats["current_streak"],
        "longest_streak": stats["longest_streak"],
        "level": level_info["level"],
        "level_xp": level_info["level_xp"],
        "next_level_xp": level_info["next_level_xp"],
        "max_level_reached": level_info["max_level_reached"],
        "daily_goal": DAILY_GOAL_XP,
        "today_xp": today_xp,
        "goal_met": goal_met,
        "last_7_days": last_7,
    }
