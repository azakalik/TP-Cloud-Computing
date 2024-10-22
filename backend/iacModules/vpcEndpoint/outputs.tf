output "id" {
    description = "The ID of the VPC endpoint."
    value       = aws_vpc_endpoint.this.id
}

output "endpoint" {
    description = "The endpoint of the VPC endpoint."
    value       = aws_vpc_endpoint.this.dns_entry[0].dns_name
}