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
                script {
                    docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}")
                }
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

