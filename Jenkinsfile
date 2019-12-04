node {
    stage('[Workspace] Clean') {
        deleteDir()
    }

    stage('[Github] Checkout Latest Source Code') {
        git branch: "${env.BRANCH_NAME}", credentialsId: 'cfchenr', url: 'https://github.com/cfchenr/softboard.git'
    }
    
    stage('[Workspace] Get variables') {
        def config = readJSON file: "config.json"
        env.BRANCH_TO_DEPLOY = config["branchToDeploy"]
    }
    
    stage('[Docker] Build and Push') {
        def imageName = 'softboard-image'
        def repo = 'softboard-snapshot/'

        if ("${env.BRANCH_NAME}" == "${env.BRANCH_TO_DEPLOY}") {
            repo = "softboard-release/"
        }

        sh "docker build . -t ${repo}${imageName}"
        def imageId = sh(returnStdout: true, script: "docker images ${repo}${imageName} -q").trim()
        def containerName = 'softboard-container'
        sh "docker run -dit --name ${containerName} -p 80:3000 ${repo}${imageName}"
    }
    stage('[Kubernetes] Deploy') {
        if ("${env.BRANCH_NAME}" == "${env.BRANCH_TO_DEPLOY}") {
            sh "kubectl apply -f ingress.yaml"
            sh "kubectl apply -f service.yaml"
            sh "kubectl apply -f deployment.yaml"
            sh "kubectl rollout restart deploy softboard-deploy"
        }
    }
}