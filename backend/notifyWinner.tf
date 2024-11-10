# Lambda function (Ensure the zip file exists in the specified location)
resource "aws_lambda_function" "send_msg_disc" {
  function_name = "sendMsgDisc"
  role          = data.aws_iam_role.iam_role_labrole.arn
  handler       = "index.handler"  # Modify as needed, depending on your function file
  runtime       = "nodejs16.x"  # Use nodejs16.x runtime or another version if needed

  # Ensure to zip and upload your function code to this location
  filename         = "./functions_zips/notifyWinner.zip"
  source_code_hash = filebase64sha256("./functions_zips/notifyWinner.zip")
}

# Lambda permission to allow EventBridge to invoke it
resource "aws_lambda_permission" "allow_eventbridge_invoke" {
  statement_id  = "EventBridgeInvokePermission"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.send_msg_disc.function_name
  principal     = "events.amazonaws.com"
  # Allow all EventBridge rules in the region and account to invoke the Lambda
  source_arn    = "arn:aws:events:us-east-1:${data.aws_caller_identity.current.account_id}:rule/*"
}

# Data source for current AWS account info to help dynamically create source ARN for the permissions
data "aws_caller_identity" "current" {}

# Lambda permission to allow EventBridge to invoke it (for any future EventBridge rule)
resource "aws_lambda_permission" "allow_eventbridge_rule_invoke" {
  statement_id  = "EventBridgeRuleInvokePermission"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.send_msg_disc.function_name
  principal     = "events.amazonaws.com"
  source_arn    = "arn:aws:events:us-east-1:${data.aws_caller_identity.current.account_id}:rule/*"  # Allow any EventBridge rule
}
