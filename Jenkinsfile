node {
    stage('[Workspace] Clean') {
        deleteDir()
    }

    stage('[Github] Checkout Latest Source Code') {
        git branch: "${env.BRANCH_NAME}", credentialsId: 'cfchenr', url: 'https://github.com/fabiohfab/docs.git'
    }
     
    stage('[Workspace] Get Variables') {
        def config = readJSON file: "config.json"
        env.BRANCH_TO_DEPLOY = config["branchToDeploy"]
        env.VERSION = config["version"]
    }
    
    stage('[Docker] Compose up') {
        sh "docker-compose up"
    }

    if ("${env.BRANCH_NAME}" == "${env.BRANCH_TO_DEPLOY}") {
        stage('[Github] Add Git Tag') {
            withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'cfchenr', usernameVariable: 'username', passwordVariable: 'password']]) {
                sh('git config user.email "c.henriques@ua.pt"')
                sh('git config user.name "cfchenr"')
                sh("git tag -a ${env.VERSION} -m " + '"tag auto generated"')
                script {
                    env.encodedPass=URLEncoder.encode(password, "UTF-8")
                }
                sh("git push https://${username}:${encodedPass}@github.com/cfchenr/softboard.git ${env.VERSION}")
            }
        }
    }
}