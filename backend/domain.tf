# # 1. Request ACM wildcard certificate
# resource "aws_acm_certificate" "wildcard" {
#   domain_name       = "*.aws.martinippolito.com.ar"
#   validation_method = "DNS"

#   lifecycle {
#     create_before_destroy = true
#   }
# }

# # 2. Create Route 53 Hosted Zone for aws.martinippolito.com.ar
# resource "aws_route53_zone" "aws_subdomain" {
#   name = "aws.martinippolito.com.ar"
# }

# # 3. Create DNS validation records for ACM Certificate
# resource "aws_route53_record" "cert_validation" {
#   for_each = {
#     for dvo in aws_acm_certificate.wildcard.domain_validation_options : dvo.domain_name => {
#       name   = dvo.resource_record_name
#       record = dvo.resource_record_value
#       type   = dvo.resource_record_type
#     }
#   }

#   zone_id = aws_route53_zone.aws_subdomain.zone_id
#   name    = each.value.name
#   type    = each.value.type
#   ttl     = 60
#   records = [each.value.record]

#   depends_on = [aws_route53_zone.aws_subdomain]
# }

# resource "aws_route53_record" "api_gateway_dns" {
#   zone_id = aws_route53_zone.aws_subdomain.zone_id   # Your Route 53 zone
#   name    = "api.aws.martinippolito.com.ar"
#   type    = "A"
#   alias {
#     name                   = aws_apigatewayv2_domain_name.api_custom_domain.domain_name_configuration[0].target_domain_name
#     zone_id                = aws_apigatewayv2_domain_name.api_custom_domain.domain_name_configuration[0].hosted_zone_id
#     evaluate_target_health = false
#   }
# }

# resource "aws_acm_certificate_validation" "wildcard_validation" {
#   certificate_arn         = aws_acm_certificate.wildcard.arn
#   validation_record_fqdns = [for record in aws_route53_record.cert_validation : record.fqdn]
# }

