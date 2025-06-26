# Use Maven with OpenJDK 17
FROM maven:3.8.6-openjdk-17-slim

# Set working directory
WORKDIR /app

# Copy source code
COPY . .

# Build the application
RUN mvn clean package -DskipTests

# Expose port 8080
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "target/buddy-0.0.1-SNAPSHOT.jar"]
