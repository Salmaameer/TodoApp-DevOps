pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "dohaelsawi/todo-app"
        DOCKER_TAG = "latest"
        REGISTRY_CREDENTIAL = 'dockerhub-credentials' 
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
                script {
                    docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}")
                }
            }
        }

        

        stage('Push') {
            steps {
                script {
                    docker.withRegistry('https://hub.docker.com/r/dohaelsawi/todo-app', "${REGISTRY_CREDENTIAL}") {
                        docker.image("${DOCKER_IMAGE}:${DOCKER_TAG}").push()
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                // Trigger Ansible playbook
                sh 'ansible-playbook -i inventory.ini playbook.yml'
            }
        }
    }

   post {
        failure {
            script {
                // Send an email when the build fails
                emailext(
                    to: 'recipient@example.com',
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

