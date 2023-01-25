aws dynamodb create-table \
  --table-name CommitMessages-qa \
  --endpoint-url http://localhost:4566 \
  --attribute-definitions AttributeName=id,AttributeType=S AttributeName=commitMessage,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH AttributeName=commitMessage,KeyType=RANGE \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5