pipeline {
    agent any

    environment {
        DOCKER_CONTAINER_NAME = "todo-app-container"
        DOCKER_IMAGE = "dohaelsawi/todo-app"
        DOCKER_CONTAINER_NAME = "todo-app-container"
        DOCKER_TAG = "latest"
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
    }

    stages {  

        stage('Debug') {
            steps {
                sh 'echo "Running as: $(whoami)"'
                sh 'docker --version'
                sh 'make --version'
            }
        }
        
        stage('Checkout') {
            steps {
                git credentialsId: 'github-pat' , branch: 'master', url: 
            }
        }

        stage('Check Docker Installation') {
            steps {
                script {
                    sh 'docker info'
                }
            }
        }

        stage('Build') {
            steps {
                sh 'make build-docker-image'
            }
        }

        stage('Push Docker image') {
            steps {
                script {
                    sh "echo ${DOCKERHUB_CREDENTIALS_PSW} | docker login -u ${DOCKERHUB_CREDENTIALS_USR} --password-stdin"
                    sh "docker push ${DOCKER_IMAGE}:${DOCKER_TAG}"
                }
            }
        }

        stage('Cleanup Old Container') {
            steps {
                script {
                    // Check if the container exists
                    def containerExists = sh(script: "docker ps -a -q -f name=${DOCKER_CONTAINER_NAME}", returnStdout: true).trim()

                    // Stop and remove the old container if it exists
                    if (containerExists) {
                        sh "docker stop ${DOCKER_CONTAINER_NAME} || true"  // Stop the container
                        sh "docker rm ${DOCKER_CONTAINER_NAME} || true"    // Remove the container
                    }
                script {
                    def containerExists = sh(script: "docker ps -a -q -f name=${DOCKER_CONTAINER_NAME}", returnStdout: true).trim()
                    if (containerExists) {
                        sh "docker stop ${DOCKER_CONTAINER_NAME} || true"
                        sh "docker rm ${DOCKER_CONTAINER_NAME} || true"
                    }
                }
            }
        }
        

        stage('Run Docker Container') {
            steps {
                sh 'make build-docker-container'
            }
        }

        // Commented-out Test stage (remove comment if needed)
        // stage('Test') {
        //     steps {
        //         sh 'npm install'
        //         sh 'npm test'
        //     }
        // }

        stage('Deploy') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'ssh-con-credentials', keyFileVariable: 'SSH_KEY')]) {
                    sh '''
                        ansible-playbook -i localhost, playbook.yml --private-key $SSH_KEY
                    '''
                }
            }
        }

    }

    post {
        success {
            emailext(
                subject: "Jenkins Build Successful: ${env.JOB_NAME} [${env.BUILD_NUMBER}]",
                body: "Good news! The build was successful.\n\nCheck it out here: ${env.RUN_DISPLAY_URL}",
                recipientProviders: [[$class: 'CulpritsRecipientProvider'], [$class: 'RequesterRecipientProvider']],
                to: 
            )
        }
        failure {
            emailext(
                to: 'salmaameer409@gmail.com',
                subject: "Build failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """
                    <p>Build <b>${env.JOB_NAME} #${env.BUILD_NUMBER}</b> failed.</p>
                    <p>Check console output at <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>
                """,
                mimeType: 'text/html'
            )
        }
    }
}
