from threading import Lock
from uuid import UUID

_contexts: dict[UUID, dict] = {}
_lock = Lock()


def save_context(context_id: UUID, prompt: str, target_language: str, insights: list[dict]) -> None:
    with _lock:
        _contexts[context_id] = {
            "prompt": prompt,
            "targetLanguage": target_language,
            "insights": insights,
        }


def get_context(context_id: UUID) -> dict | None:
    with _lock:
        return _contexts.get(context_id)
