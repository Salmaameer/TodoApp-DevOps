pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "dohaelsawi/todo-app"
        DOCKER_TAG = "latest"
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
    }

    stages {

        stage('Checkout') {
            steps {
                git credentialsId: 'github-pat' , branch: 'master', url: 'https://github.com/Salmaameer/TodoApp-devops-automation.git'
            }
        }

         stage('Check Docker Installation') {
            steps {
                script {
                    // Check if Docker is installed and the daemon is running
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
                    // log in to the docker hub
                    sh "echo ${DOCKERHUB_CREDENTIALS_PSW} | docker login -u ${DOCKERHUB_CREDENTIALS_USR} --password-stdin"

                    // Push the Docker image to Docker Hub
                    sh "docker push ${DOCKER_IMAGE}:${DOCKER_TAG}"
                }
            }
        }
         stage('Cleanup Old Container') {
            steps {
                script {
                    // Check if the container exists
                    def containerExists = sh(script: "docker ps -a -q -f name=${DOCKER_IMAGE}", returnStdout: true).trim()

                    // Stop and remove the old container if it exists
                    if (containerExists) {
                        sh "docker stop ${DOCKER_IMAGE} || true"  // Stop the container
                        sh "docker rm ${DOCKER_IMAGE} || true"    // Remove the container
                    }
                }
            }
        }
        stage('Run Docker Container') {
            steps {
                // Use Makefile to run the Docker container
                sh 'make build-docker-container'
            }
        }
        stage('Verify Container is Running') {
            steps {
                // Verify if the container is running
                sh 'docker ps | grep todo-app'
            }
        }

      stage('Deploy') {
            steps {
                // Run Ansible playbook to deploy the application
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
                to: 'salmaameer409@gmail.com'
            )
        }
        failure {
            script {
                // Send an email when the build fails
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
}

