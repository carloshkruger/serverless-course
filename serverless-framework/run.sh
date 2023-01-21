npm i -g serverless@3.16.0

sls
  - AWS - Node.js - HTTP API
  - Project name
  - login/register no
  - deploy yes

# Every time the code change, use the below command for deploy
sls deploy

# get information on AWS
sls info

sls invoke local -f hello

sls invoke -f hello

sls remove