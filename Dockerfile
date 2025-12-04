FROM eclipse-temurin:21-jdk-jammy AS builder
WORKDIR /app
COPY ../../Users/User/OneDrive/바탕%20화면 .

RUN ./gradlew clean build -x test

# Second stage: create the runtime image
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
# This Dockerfile uses a multi-stage build to first compile a Java application using Gradle,
# and then creates a smaller runtime image containing only the necessary JRE and the compiled application.
# The application listens on port 8080.
# To build the Docker image, use:
# docker build -t my-java-app .
# To run the Docker container, use:
# docker run -p 8080:8080 my-java-app
