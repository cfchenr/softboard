node {
    stage('[Workspace] Clean') {
        deleteDir()
    }

    stage('[Github] Checkout Latest Source Code') {
        git branch: "${env.BRANCH_NAME}", credentialsId: 'cfchenr', url: 'https://github.com/cfchenr/softboard.git'
    }
     
    stage('[Workspace] Get Variables') {
        def config = readJSON file: "config.json"
        env.BRANCH_TO_DEPLOY = config["branchToDeploy"]
        env.VERSION = config["version"]
    }
    
    stage('[Docker] Build and Run') {
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
        sh "docker stop ${containerName} || true && docker rm ${containerName} || true"
    }

    stage('[k8s] Deploy') {
        sh "kubectl apply -f ingress.yaml"
        sh "kubectl apply -f service.yaml"
        sh "kubectl apply -f deployment.yaml"
        sh "kubectl rollout restart deploy softboard-deploy"
        sh "kubectl get pods"
        sh "kubectl get deploy"
        sh "kubectl get svc"
        sh "kubectl get ingress"
    }
    
    // @todo Add kubernetes stage
    // @body Create kubernetes stage to deploy application

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
