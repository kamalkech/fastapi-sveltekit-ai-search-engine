"""high level support for doing this and that."""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Class representing a person"""

    OPENAI_KEY: str
    SERPER_API_KEY: str
    TAVILY_API_KEY: str

    model_config = SettingsConfigDict(env_file=".env")
