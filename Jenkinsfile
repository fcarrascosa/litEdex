pipeline {
  agent {
    dockerfile {
      filename 'Dockerfile'
      args '-u root:root -v /var/lib:/host/var/lib'
    }
  }
  stages {
    stage("Install Dependencies") {
      steps {
        sh "npm ci"
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
      post {
        always {
          junit 'coverage/test-results.xml'
          cobertura coberturaReportFile: 'coverage/cobertura-coverage.xml'
        }
      }
    }
    stage("Build") {
      steps {
        sh "npm run build"
      }
    }
    stage("Generate Artifacts And Copy to Public Directory") {
      parallel {
        stage("Artifact Generation") {
          steps {
            archiveArtifacts artifacts: 'dist/**/*.*', fingerprint: true
          }
        }
        stage("Copy Artifact to nginx web folder") {
          stages {
            stage("Store Artifact in webroot") {
              steps {
                sh "mkdir -p /host/var/lib/www/html/demos/${env.JOB_NAME.split('/')[0]}/${env.BRANCH_NAME}"
                sh "cp -R ./dist/* /host/var/lib/www/html/demos/${env.JOB_NAME.split('/')[0]}/${env.BRANCH_NAME}"
                echo "This branch's build has been successfully published to nginx server"
                echo "You can test it at"
                echo "https://demos.fcarrascosa.es/lit-edex/${env.BRANCH_NAME}"
              }
            }
            stage("Store Url in Build Result") {
              steps {
                script {
                  def linkToEnv = '<a href="' + "https://demos.fcarrascosa.es/lit-edex/${env.BRANCH_NAME}" + '" target="_blank">Live Environment</a>'
                  currentBuild.description = linkToEnv
                }
              }
            }
          }
        }
      }
    }
    stage('Generate Changelog and New Versions') {
      when {
        branch pattern: "release\\/.*", comparator: "REGEXP"
      }
      steps {
        sh 'git config user.name jenkins'
        sh 'npx standard-version'
        withCredentials([usernamePassword(credentialsId: 'github', passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
           echo "${GIT_USERNAME}"
           sh "git push https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/fcarrascosa/litEdex.git HEAD"
           sh "git push origin --tags"
        }
      }
    }
  }
  post {
    always {
      cleanWs()
    }
  }
}
