import math
from uuid import UUID, uuid4

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .dummy_data import generate_insights
from .schemas import (
    MIN_PROMPT_LENGTH,
    SUPPORTED_LANGUAGES,
    ClarificationResponse,
    ErrorResponse,
    Insight,
    InsightRequest,
    Pagination,
    SuccessResponse,
)
from .store import get_context, save_context

app = FastAPI(title="AI Middleware API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DEFAULT_PAGE_SIZE = 10


def _paginate(insights: list[dict], page: int, page_size: int) -> tuple[list[dict], Pagination]:
    total = len(insights)
    total_pages = max(1, math.ceil(total / page_size))
    start = (page - 1) * page_size
    end = start + page_size
    page_items = insights[start:end]
    pagination = Pagination(page=page, pageSize=page_size, total=total, totalPages=total_pages)
    return page_items, pagination


@app.post(
    "/api/insights",
    response_model=None,
)
def create_insights(payload: InsightRequest):
    if not payload.prompt:
        return JSONResponse(
            status_code=400,
            content=ErrorResponse(
                error="MISSING_PROMPT", message="Prompt is required."
            ).model_dump(),
        )

    if payload.targetLanguage not in SUPPORTED_LANGUAGES:
        return JSONResponse(
            status_code=400,
            content=ErrorResponse(
                error="INVALID_LANGUAGE",
                message=f"Target language '{payload.targetLanguage}' is not supported.",
            ).model_dump(),
        )

    if len(payload.prompt) < MIN_PROMPT_LENGTH:
        return ClarificationResponse(
            message="Your prompt is too short. Please provide more details."
        )

    context_id = payload.contextId or uuid4()
    insights = generate_insights(payload.prompt, payload.targetLanguage)
    save_context(context_id, payload.prompt, payload.targetLanguage, insights)

    page_items, pagination = _paginate(insights, page=1, page_size=DEFAULT_PAGE_SIZE)

    return SuccessResponse(
        contextId=context_id,
        insights=[Insight(**item) for item in page_items],
        pagination=pagination,
    )


@app.get("/api/insights/{context_id}", response_model=None)
def list_insights(
    context_id: UUID,
    page: int = Query(default=1, ge=1),
    pageSize: int = Query(default=DEFAULT_PAGE_SIZE, ge=1, le=50),
):
    context = get_context(context_id)
    if context is None:
        return JSONResponse(
            status_code=404,
            content=ErrorResponse(
                error="CONTEXT_NOT_FOUND", message="No insights found for this contextId."
            ).model_dump(),
        )

    page_items, pagination = _paginate(context["insights"], page=page, page_size=pageSize)

    return SuccessResponse(
        contextId=context_id,
        insights=[Insight(**item) for item in page_items],
        pagination=pagination,
    )


@app.get("/api/health")
def health():
    return {"status": "ok"}
