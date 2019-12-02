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
        sh "docker push ${repo}${imageName}"
        sh "docker image prune -f"
        def imageId = sh(returnStdout: true, script: "docker images ${repo}${imageName} -q").trim()
        sh "docker rmi -f ${imageId}"
    }
    stage('[Kubernetes] Pull and Deploy') {
        if ("${env.BRANCH_NAME}" == "${env.BRANCH_TO_DEPLOY}") {
            sh "kubectl apply -f ingress.yaml"
            sh "kubectl apply -f service.yaml"
            sh "kubectl apply -f deployment.yaml"
            sh "kubectl rollout restart deploy softboard-deploy"
        }
    }
}