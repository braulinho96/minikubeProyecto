# Usar la imagen base de OpenJDK 17
FROM openjdk:17-buster

# Instalar Git (para Debian/Ubuntu, que es la base de la imagen OpenJDK)
RUN apt-get update && apt-get install -y git

# Definir una variable de argumento para el archivo .jar (usando el valor predeterminado)
ARG JAR_FILE=target/config-service.jar

# Copiar el archivo .jar desde tu máquina local al contenedor Docker
COPY ${JAR_FILE} config-service.jar

# Definir el comando que se ejecutará cuando se inicie el contenedor
ENTRYPOINT ["java", "-jar", "/config-service.jar"]
