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
                git credentialsId:'github-pat' branch: 'master', url: 'https://github.com/Salmaameer/TodoApp-devops-automation'
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
        success {
            mail to: 'm.mohamed112002@gmail.com',
                 subject: "Jenkins Build Successful: ${env.JOB_NAME} ${env.BUILD_NUMBER}",
                 body: "Good news! The build was successful."
        }
        failure {
            mail to: 'salmaameer409@gmail.com',
                 subject: "Jenkins Build Failed: ${env.JOB_NAME} ${env.BUILD_NUMBER}",
                 body: "Oops! The build failed. Please check the Jenkins job for details."
        }
    }
}

