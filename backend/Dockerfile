# ==========================================
# Stage 1: Build Java Spring Boot Application
# ==========================================
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy pom.xml and source code
COPY pom.xml .
COPY src ./src

# Build JAR package (skip unit tests for faster image build)
RUN mvn clean package -DskipTests

# ==========================================
# Stage 2: Production JRE Runtime
# ==========================================
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Create non-root application user for container security
RUN groupadd -r connectai && useradd -r -g connectai connectai

# Copy compiled JAR artifact from builder
COPY --from=build /app/target/connectai-backend-1.0.0.jar /app/app.jar

# Environment Variables
ENV PORT=8080
ENV SPRING_PROFILES_ACTIVE=prod
ENV JAVA_OPTS="-Xms256m -Xmx512m -XX:+UseG1GC"

EXPOSE 8080

USER connectai

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]
