"""high level support for doing this and that."""

import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

# Router
from app.routers import answer, search_stream

app = FastAPI()

# origins = [
#     "http://localhost.tiangolo.com",
#     "https://localhost.tiangolo.com",
#     "http://localhost",
#     "http://localhost:8080",
#     "https://0.0.0.0:3000",
#     "http://0.0.0.0:3000",
# ]
#
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

origins = [
    "https://www.zeia.ma",
    "https://zeia.ma",  # Include this if you also use the apex domain
    # You may want to include localhost for development
    "http://localhost:3000",
    "https://localhost:3000",  # Default SvelteKit dev server port
    "http://127.0.0.1:3000",
    "https://127.0.0.1:3000",  # Default SvelteKit dev server port
    "http://backend:3000",
    "https://backend:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


@app.middleware("http")
async def add_cors_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "*"
    return response


app.include_router(search_stream.router, prefix="/search_stream")
app.include_router(answer.router, prefix="/answer")


@app.get("/")
async def root():
    return {"message": "Hello World"}


if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
