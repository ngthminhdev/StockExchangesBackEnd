pipeline {
    agent any
    environment {
        registryUrl = "https://index.docker.io/v1/"
        credentialsId = "DOCKER_HUB"
        DOCKER_HUB = credentials('DOCKER_HUB')
        dockerImageName = "electric-board-backend"
        dockerfilePath = "./docker"
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Get version') {
            steps {
                script {
                    VERSION = sh(returnStdout: true, script: "cat package.json | jq -r '.version'").trim()
                    echo "Version: $VERSION"
                }
            }
        }

        stage('Compress Code') {
            steps {
                sh 'chmod +x ./compress.sh && ./compress.sh'
            }
        }

        stage('Build Image') {
            steps {
                script {
                    def newImage = docker.build('ngthminhdev/electric-board-backend', './docker')
                    newImage.push()
                }
            }
        }

//         stage('Build and Push Docker Image') {
//             steps {
//                 script {
//                     withDockerRegistry([credentialsId: credentialsId, url: registryUrl]) {
//                         def dockerImage = docker.build("ngthminhdev/electric-board-backend:${VERSION}", "./docker")
//                         dockerImage.push()
//                     }
//                 }
//             }
//         }
    }

    post {
        always {
            cleanWs()
        }
    }
}