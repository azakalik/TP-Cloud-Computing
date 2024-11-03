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

    dynamic "vpc_config" {
        for_each = var.vpc_config != null ? [var.vpc_config] : []
        content {
            subnet_ids = vpc_config.value.subnet_ids
            security_group_ids = vpc_config.value.security_group_ids
        }      
    }
}

resource "aws_apigatewayv2_integration" "integration" {
    count = var.api_gw_id != null ? 1 : 0
    api_id = var.api_gw_id
    integration_uri = aws_lambda_function.function.arn
    integration_type = "AWS_PROXY"
    credentials_arn = var.role_arn
}

resource "aws_apigatewayv2_route" "route" {
    count = var.api_gw_id != null ? 1 : 0
    api_id = var.api_gw_id
    route_key = var.route_key
    target = join("/", ["integrations", aws_apigatewayv2_integration.integration[0].id])
    authorization_type = var.has_jwt_authorizer ? "JWT" : null
    authorizer_id = var.has_jwt_authorizer ? var.authorizer_id : null
}

resource "aws_lambda_permission" "permission" {
    count = var.api_gw_id != null ? 1 : 0
    statement_id = "AllowExecutionFromAPIGateway"
    action = "lambda:InvokeFunction"
    function_name = aws_lambda_function.function.function_name
    principal = "apigateway.amazonaws.com"
    source_arn = join("/", [var.api_gw_execution_arn, "*", "*"])  
}