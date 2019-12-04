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
    
    stage('[Docker] Build') {
        def imageName = 'softboard-image'
        def containerName = 'softboard-container-snapshot'
        def repo = 'softboard-snapshot/'
        def port = 8888
        if ("${env.BRANCH_NAME}" == "${env.BRANCH_TO_DEPLOY}") {
            repo = "softboard-release/"
            containerName = 'softboard-container-released'
            port = 80
        }

        sh "docker build . -t ${repo}${imageName}"
        sh "docker run -dit --name ${containerName} -p ${port}:3000 ${repo}${imageName}" 
    }

    stage('[Kubernetes] Deploy') {
        if ("${env.BRANCH_NAME}" == "${env.BRANCH_TO_DEPLOY}") {
            // sh "kubectl apply -f traefik-rbac.yaml"
            // sh "kubectl apply -f traefik.yaml"
            // sh "kubectl apply -f ingress.yaml"
            // sh "kubectl apply -f service.yaml"
            // sh "kubectl apply -f deployment.yaml"
            // sh "kubectl rollout restart deploy softboard-deploy"
            // sh "kubectl get pods"
            // sh "kubectl get deploy"
            // sh "kubectl get svc"
            // sh "kubectl get ingress"
        }
    }
}