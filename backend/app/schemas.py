from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field, field_validator

SUPPORTED_LANGUAGES = {"en", "es", "fr", "de", "it", "pt", "ja"}
MIN_PROMPT_LENGTH = 5


class InsightRequest(BaseModel):
    prompt: str
    targetLanguage: str
    contextId: Optional[UUID] = None

    @field_validator("prompt")
    @classmethod
    def prompt_not_blank(cls, value: str) -> str:
        return value.strip()


class Insight(BaseModel):
    id: str
    title: str
    content: str
    category: str
    createdAt: str


class Pagination(BaseModel):
    page: int
    pageSize: int
    total: int
    totalPages: int


class SuccessResponse(BaseModel):
    status: str = "SUCCESS"
    contextId: UUID
    insights: list[Insight]
    pagination: Pagination


class ClarificationResponse(BaseModel):
    status: str = "NEEDS_CLARIFICATION"
    message: str = Field(default="Please provide more details about your request.")


class ErrorResponse(BaseModel):
    error: str
    message: str
