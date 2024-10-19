resource "aws_vpc_endpoint" "this" {
    vpc_id              = var.vpc_id
    service_name        = join(".", ["com.amazonaws", var.aws_region, var.service_name])
    vpc_endpoint_type   = "Interface"
    subnet_ids          = var.subnet_ids
    security_group_ids  = var.security_group_ids

    dns_options {
        dns_record_ip_type = "ipv4"
    }

    tags = {
        Name = var.name
    }

    policy = jsonencode({
        Version = "2012-10-17",
        Statement = [
            for statement in var.policy_statements : {
                Effect = statement.Effect
                Action = statement.Action
                Resource = statement.Resource
                Principal = {
                    AWS = statement.PrincipalArn
                }
            }
        ]
    })
}