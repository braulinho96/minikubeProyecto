pipeline {
    agent any
    tools {
        nodejs 'nodejs_22.9.0'  
    }
    stages{
        stage('Clone repository') {
            steps {
                checkout scmGit(branches: [[name: '*/main']], extensions: [], userRemoteConfigs: [[url: 'https://github.com/braulinho96/frontendProyecto']])
            }
        }

        stage('Install dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build React App') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Build docker image'){
            steps{
                script{
                    sh 'docker build -t braulinho/tingesofrontend:latest .'
                }
            }
        }
        stage('Push frontend image to Docker Hub') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'dockerCredentials', usernameVariable: 'dhpUser', passwordVariable: 'dhpsw')]) {
                        sh 'docker login -u $dhpUser -p $dhpsw'
                    }
                    sh 'docker push braulinho/tingesofrontend:latest'
                }
            }
        }

    }
}