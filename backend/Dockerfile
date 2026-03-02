# build stage uses an image with Gradle installed so we don't need the
# wrapper file in the repository.
FROM gradle:7.6.4-jdk17 AS build
WORKDIR /home/gradle/project
COPY . .
# run the build, skipping tests for speed
RUN gradle build -x test --no-daemon

# runtime stage uses Eclipse Temurin JRE (supports both amd64 and arm64/Mac)
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /home/gradle/project/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
