output "vpc_endpoint_id" {
    description = "The ID of the VPC endpoint."
    value       = aws_vpc_endpoint.this.id
}