pipeline {
  agent {
    dockerfile {
      filename 'Dockerfile'
      args '-u root:root'
    }
  }
  stages {
    stage("Install Dependencies") {
      steps {
        sh "npm install"
      }
    }
    stage("Linting and Style Check") {
      parallel {
        stage("ESlint check") {
          steps {
            sh "npm run lint:eslint"
          }
        }
        stage("Prettier check") {
          steps {
            sh "npm run lint:prettier"
          }
        }
      }
    }
    stage("Unit Tests") {
      steps {
        sh "npm run test"
      }
    }
    stage("Build") {
      steps {
        sh "npm run build"
      }
    }
  }
  post {
    always {
      cleanWs()
    }
  }
}
