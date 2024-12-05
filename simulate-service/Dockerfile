# Usar la imagen base de OpenJDK 17
FROM openjdk:17

# Definir una variable de argumento para el archivo .jar (usando el valor predeterminado)
ARG JAR_FILE=target/simulate-service.jar

# Copiar el archivo .jar desde tu máquina local al contenedor Docker
COPY ${JAR_FILE} simulate-service.jar

# Definir el comando que se ejecutará cuando se inicie el contenedor
ENTRYPOINT ["java", "-jar", "/simulate-service.jar"]
