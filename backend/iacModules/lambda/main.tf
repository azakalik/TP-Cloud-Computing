resource "aws_lambda_function" "function" {
    function_name = var.function_name
    handler = var.handler
    runtime = var.runtime
    filename = var.filename
    role = var.role_arn
    source_code_hash = filebase64sha256(var.filename)
    timeout = var.timeout
    environment {
        variables = var.env_vars
    }
}

resource "aws_apigatewayv2_integration" "integration" {
    count = var.integrates_with_api_gw ? 1 : 0
    api_id = var.api_gw_id
    integration_uri = aws_lambda_function.function.arn
    integration_type = "AWS_PROXY"
    credentials_arn = var.role_arn
}

resource "aws_apigatewayv2_route" "non_jwt_route" {
    count = var.integrates_with_api_gw && !var.has_jwt_authorizer ? 1 : 0
    api_id = var.api_gw_id
    route_key = var.route_key
    target = join("/", ["integrations", aws_apigatewayv2_integration.integration[0].id])
}

resource "aws_apigatewayv2_route" "jwt_route" {
    count = var.integrates_with_api_gw && var.has_jwt_authorizer ? 1 : 0
    api_id = var.api_gw_id
    route_key = var.route_key
    target = join("/", ["integrations", aws_apigatewayv2_integration.integration[0].id])
    authorization_type = "JWT"
    authorizer_id = var.authorizer_id  
}

resource "aws_lambda_permission" "permission" {
    count = var.integrates_with_api_gw ? 1 : 0
    statement_id = "AllowExecutionFromAPIGateway"
    action = "lambda:InvokeFunction"
    function_name = aws_lambda_function.function.function_name
    principal = "apigateway.amazonaws.com"
    source_arn = join("/", [var.api_gw_execution_arn, "*", "*"])  
}