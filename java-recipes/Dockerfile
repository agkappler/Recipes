
FROM openjdk:21-jdk

# Set a working directory
WORKDIR /java-recipes

# Copy the Spring Boot JAR into the image
COPY build/libs/java-recipes-0.0.1-SNAPSHOT.jar java-recipes.jar

# Expose the port your app runs on (default is 8080)
EXPOSE 8080

# Run the JAR
ENTRYPOINT ["java", "-Dspring.profiles.active=prod", "-jar", "java-recipes.jar"]


