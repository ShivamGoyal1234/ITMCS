import random
from datetime import datetime, timezone

CATEGORIES = ["Sentiment", "Summary", "Keyword", "Trend", "Risk", "Opportunity"]

TITLE_TEMPLATES = [
    "Key theme detected in \"{prompt}\"",
    "Sentiment shift related to \"{prompt}\"",
    "Emerging pattern for \"{prompt}\"",
    "Risk signal around \"{prompt}\"",
    "Opportunity uncovered from \"{prompt}\"",
    "Summary point on \"{prompt}\"",
]

CONTENT_TEMPLATES = [
    "Analysis of the prompt suggests a notable {category} signal with moderate confidence.",
    "The AI middleware identified a {category} pattern worth reviewing for target language '{lang}'.",
    "Cross-referencing historical context yields a {category} insight for this request.",
    "This finding highlights a {category} aspect translated into '{lang}'.",
]


def generate_insights(prompt: str, target_language: str, count: int = 23) -> list[dict]:
    rng = random.Random(f"{prompt}:{target_language}")
    insights = []
    now = datetime.now(timezone.utc)
    for i in range(count):
        category = rng.choice(CATEGORIES)
        title = rng.choice(TITLE_TEMPLATES).format(prompt=prompt[:40])
        content = rng.choice(CONTENT_TEMPLATES).format(category=category.lower(), lang=target_language)
        insights.append(
            {
                "id": f"insight-{i + 1}",
                "title": f"{title} #{i + 1}",
                "content": content,
                "category": category,
                "createdAt": now.isoformat(),
            }
        )
    return insights
