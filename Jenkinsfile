node {
    stage('[Workspace] Clean') {
        deleteDir()
    }
    stage('[Github] Checkout latest source code') {
        checkout scm: [
            $class: 'GitSCM',
            branches: scm.branches,
            doGenerateSubmoduleConfigurations: scm.doGenerateSubmoduleConfigurations,
            extensions: scm.extensions,
            userRemoteConfigs: scm.userRemoteConfigs
        ]
    }
    stage('build') {
        echo 'build'
    }
    stage('push') {
        echo 'push'
    }
    stage('deploy') {
        echo 'deploy'
    }
}