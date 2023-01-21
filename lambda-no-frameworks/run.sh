ROLE_NAME=lambda-example
NODEJS_VERSION=nodejs18.x
FUNCTION_NAME=hello-cli

mkdir -p logs

aws iam create-role \
  --role-name $ROLE_NAME \
  --assume-role-policy-document file://policies.json \
  | tee logs/1.role.log

POLICY_ARN=$(cat logs/1.role.log | jq -r .Role.Arn)

zip function.zip index.js

aws lambda create-function \
  --function-name $FUNCTION_NAME \
  --zip-file fileb://function.zip \
  --runtime $NODEJS_VERSION \
  --role $POLICY_ARN \
  --handler index.handler \
  | tee logs/2.lambda-create.log

sleep 2

aws lambda invoke \
  --function-name $FUNCTION_NAME logs/3.lambda-exec.log \
  --log-type Tail \
  --query "LogResult" \
  --output text | base64 -d

aws lambda update-function-code \
  --function-name $FUNCTION_NAME \
  --zip-file fileb://function.zip \
  --publish \
  | tee logs/4.lambda-update.log

aws lambda invoke \
  --function-name $FUNCTION_NAME logs/5.lambda-exec-2.log \
  --log-type Tail \
  --query "LogResult" \
  --cli-binary-format raw-in-base64-out \
  --payload '{"name":"test"}' \
  --output text | base64 -d

aws lambda delete-function --function-name $FUNCTION_NAME

aws iam delete-role --role-name $ROLE_NAME