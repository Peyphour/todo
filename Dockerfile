FROM openjdk:8-jdk-alpine
ADD . /app
EXPOSE 8080/tcp
ENTRYPOINT ["/app/gradlew","bootRun", "-p", "/app"]
