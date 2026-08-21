"""Consistent JSON error responses across the API."""
import logging

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

logger = logging.getLogger("app")


class AppError(Exception):
    """Base class for expected application errors mapped to a specific HTTP status."""

    def __init__(self, status_code: int, detail: str):
        self.status_code = status_code
        self.detail = detail


class NotFoundError(AppError):
    def __init__(self, detail: str = "Resource not found"):
        super().__init__(status.HTTP_404_NOT_FOUND, detail)


class ConflictError(AppError):
    def __init__(self, detail: str = "Conflict"):
        super().__init__(status.HTTP_409_CONFLICT, detail)


class ForbiddenError(AppError):
    def __init__(self, detail: str = "Forbidden"):
        super().__init__(status.HTTP_403_FORBIDDEN, detail)


class BadRequestError(AppError):
    def __init__(self, detail: str = "Bad request"):
        super().__init__(status.HTTP_400_BAD_REQUEST, detail)


def _error_body(detail: str) -> dict:
    return {"error": {"detail": detail}}


def register_error_handlers(app: FastAPI) -> None:
    @app.exception_handler(AppError)
    async def app_error_handler(request: Request, exc: AppError):
        return JSONResponse(status_code=exc.status_code, content=_error_body(exc.detail))

    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(request: Request, exc: StarletteHTTPException):
        return JSONResponse(status_code=exc.status_code, content=_error_body(str(exc.detail)))

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content=_error_body(exc.errors()),
        )

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(request: Request, exc: Exception):
        logger.exception("Unhandled exception on %s %s", request.method, request.url.path)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content=_error_body("Internal server error"),
        )
