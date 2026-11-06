FROM python:3.13-slim

# Build a different version with:  docker build --build-arg VERSION=2.0 -t botley:2.0 .
ARG VERSION=1.0
ENV BOTLEY_VERSION=$VERSION PYTHONUNBUFFERED=1

WORKDIR /app
COPY app.py .

# Don't run as root inside the container.
RUN useradd --create-home botley
USER botley

EXPOSE 8080
CMD ["python", "app.py"]
