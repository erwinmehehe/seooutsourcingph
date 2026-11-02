FROM python:3.13-slim
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
RUN groupadd --system sop && useradd --system --gid sop --home-dir /app sop
WORKDIR /app
COPY --chown=sop:sop app/ /app/
RUN mkdir -p /var/lib/sop && chown sop:sop /var/lib/sop
USER sop
EXPOSE 8080
CMD ["python", "backend/serve.py", "--host", "0.0.0.0", "--port", "8080"]
